const express = require('express');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { spawn } = require('child_process');
const router = express.Router();
const User = require("../model/userInfoSchema");
const auth = require('../middleware/auth');
const upload = require('../model/upImages');
const passport = require('passport');
const { DateTime } = require('luxon');
 
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/fail' }),
    async (req, res) => {
        try {
            const token = await req.user.generateAuthToken();

            res.cookie("jwt", token, {
              expires: new Date(Date.now() + 3000000),
              httpOnly: true
            });
    
            res.redirect('/home');
        }
        catch (error) {
            console.log(error);
        }
    }
);

router.get("/fail", (req, res) => {
    res.render("sessionout.hbs", {
        msg: "Something went wrong"
    })
})

router.get("/", (req, res) => {
    console.log("client ip address is => " + req.ip);
    res.render('index.hbs', {
        isLoggedIn: false,
        signOutBtn: true
    });
});

router.get("/registration", (req, res) => {
    res.render("registration.hbs", {
        signOutBtn: true
    });
});

router.get("/home", auth, (req, res) => {
    res.render("home.hbs", {
        userName: req.user.name,
        isLoggedIn: true,
        signInBtn: false
    });
});

router.get("/aboutus", auth, (req, res) => {
    res.render("aboutus.hbs", {
        signOutBtn: false,
        userName: req.user.name
    });
});

router.get("/about", (req, res) => {
    res.render("about.hbs");
});

router.get("/services", auth, (req, res) => {
    res.render("services.hbs", {
        signOutBtn: false,
        userName: req.user.name
    })
});

router.get("/contect", (req, res) => {
    res.render("contactus.hbs");
});

router.get("/privacypolicy", (req, res) => {
    res.render("privacypolicy.hbs");
});

router.get("/tandc", (req, res) => {
    res.render("tandc.hbs");
});

router.get("/contect1",auth, (req, res) => {
    res.render("contactus copy.hbs");
});

router.get("/privacypolicy1",auth, (req, res) => {
    res.render("privacypolicy copy.hbs");
});

router.get("/tandc1",auth, (req, res) => {
    res.render("tandc copy.hbs");
});

router.get("/iprocess", auth, (req, res) => {
    res.render("imageprocess.hbs", {
        userName: req.user.name
    });
});

router.get("/emonitor", auth, (req, res) => {
    res.render("environmentmonitor.hbs", {
        userName: req.user.name
    });
});

router.get("/soilsubmit", auth, (req, res) => {
    res.render("soilinput.hbs", {
        userName: req.user.name
    });
});


router.post('/emonitor',auth,  async (req, res) => {
    const { location, parameter, time_interval } = req.body;
  
    try {
      // Make the API request to OpenWeatherMap
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.WHEATHER_API_KEY}&units=metric`);
      const weatherData = response.data;
   
      // Extract the needed data 
      const timestamps = weatherData.list.map(item => item.dt);
      let values;
  
      switch (parameter) {
        case 'temperature':
          values = weatherData.list.map(item => item.main.temp);
          break;
        case 'humidity':
          values = weatherData.list.map(item => item.main.humidity);
          break;
        case 'windSpeed':
          values = weatherData.list.map(item => item.wind.speed);
          break;
        default:
          values = [];
      }
  
      let labels;
      switch (time_interval) {
        case 'hour':
          labels = timestamps.map(ts => DateTime.fromMillis(ts * 1000).toFormat('HH:mm'));
          break;
        case 'day':
          labels = timestamps.map(ts => DateTime.fromMillis(ts * 1000).toFormat('yyyy-MM-dd'));
          break;
        case 'month':
          labels = timestamps.map(ts => DateTime.fromMillis(ts * 1000).toFormat('yyyy-MM'));
          break;
        default:
          labels = [];
      }
  
      res.json({
        labels: labels,
        values: values
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
  

router.post("/soil", auth, async (req, res) => {
    // const api = process.env.WHEATHER_API_KEY;
    // const city = req.body.city;

    let { nitrogen, phosphorus, potassium, ph, humidity, temperature, rainfall } = req.body;

    const N = (parseFloat(nitrogen));
    const P = (parseFloat(phosphorus));
    const K = (parseFloat(potassium));
    temperature = (parseFloat(temperature));
    humidity = (parseFloat(humidity));
    rainfall = (parseFloat(rainfall));
    const pHValue = parseFloat(ph);

    console.log(N);
    console.log(P);
    console.log(K);
    console.log(temperature);
    console.log(humidity);
    console.log(potassium);


    try {
        // console.log(api);
        // console.log(city);
        // const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`);
        // const weatherData = weatherResponse.data;
        // const temperature = weatherData.main.temp;
        // const humidity = weatherData.main.humidity;
        // // we nee api which can show rainfall as well it is avalible but not for all
        // const rainfall = weatherData.rain ? weatherData.rain['1h'] || 0 : 0;
        // console.log(rainfall); 
        // console.log(humidity);
        // console.log(temperature);

        const weightN = 0.3;
        const weightP = 0.3;
        const weightK = 0.3;
        const weightPH = 0.1;

        const weightedSum = (N * weightN) + (P * weightP) + (K * weightK) + (pHValue * weightPH);
        const totalWeight = weightN + weightP + weightK + weightPH;
        const overallSoilHealth = weightedSum / totalWeight;

        const runPythonScript = () => {
            return new Promise((resolve, reject) => {
                const pythonProcess = spawn('python', [
                    '../easyFarm/src/python_scripts/predict_crop.py',
                    N,          //data from user
                    P,          //data from user
                    K,          //data frpm user
                    temperature,//data from api
                    humidity,   //data from api
                    pHValue,    //data from api
                    rainfall    //data frpm api
                ]);

                pythonProcess.stdout.on('data', (data) => {
                    resolve(data.toString().trim());
                });

                pythonProcess.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                    reject(data.toString());
                });
            });
        };

        const prediction = await runPythonScript();

        res.render("soil.hbs", {
            recommendation: prediction,
            userName: req.user.name,
            valueN: N.toFixed(2),
            valueP: P.toFixed(2),
            valueK: K.toFixed(2),
            valuePH: pHValue.toFixed(2),
            averageValue: ((N + P + K) / 3).toFixed(2),
            sliderN: 100 - N,
            sliderP: 100 - P,
            sliderK: 100 - K,
            averageSlider: 100 - ((N + P + K) / 3).toFixed(2),
            sliderPH: 100 - (pHValue * 7.2),
            overallSoilHealth: overallSoilHealth.toFixed(2)
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get("/price", auth, (req, res) => {
    res.render("price.hbs", {
        userName: req.user.name
    });
});

router.get("/imageresult", auth, (req, res) => {
    // function which will take the image path
    // and return object contain the dname dinfo and dcure
    // so that we can use the data to show the cure
    // const processedData = processImage(req.user.imagePath);
    res.render("iprocessresults.hbs", {
        userName: req.user.name,
        processedImage: req.user.imagePath,
        diseaseName: "",//processedData.dname,
        diseaseInfo: "",//processedData.dinfo,
        recommendedCure: ""// processedData.dcure
    });
});

// // I hve to use the model here 
// const processImage = (imagePath) => {
//     // using model


//     return processedData;
// };

// Add upload route
router.post('/upload', auth, upload.single('cropImage'), async (req, res) => {
    try {
        req.user.imagePath = "./images/" + req.file.filename;
        await req.user.save();
        res.status(200).redirect('/imageresult');
        
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(400).send('Error uploading file');
    }
});

router.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currentElement) => {
            return currentElement.token !== req.token;
        });

        res.clearCookie("jwt");

        await req.user.save();

        res.redirect('/');
    } catch (error) {
        res.status(500).send("error");
    }
});

router.post("/signin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = await user.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3000000), 
                httpOnly: true,
            });

            res.status(201);
            res.redirect('/home');
        } else {
            res.send("Invalid credentials");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("Invalid credentials");
    }
});

router.post("/signup", async (req, res) => {
    try {
        const userName = req.body.name;
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        const userConfirmPassword = req.body.confirmPassword;

        if (userPassword === userConfirmPassword) {
            const user = new User({
                name: userName,
                email: userEmail,
                password: userPassword,
                confirmPassword: userConfirmPassword
            });

            const token = await user.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3000000),
                httpOnly: true
            });

            await user.save();
            res.status(201);

            res.redirect("/home");
        } else {
            res.send("Passwords do not match");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

module.exports = router;
