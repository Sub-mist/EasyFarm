# EasyFarm

EasyFarm is a comprehensive web application designed to provide farmers and agriculturists with useful tools and insights for managing crops. The application features a dashboard that displays graphs of temperature, humidity, and windspeed. It also includes a recommendation system for suggesting suitable crops based on various environmental and soil parameters.

## Features

- **Dashboard**: Graphs and visualizations for temperature, humidity, and wind speed.
- **Crop Recommendation**: Suggests crops based on potassium, temperature, humidity, rainfall, nitrogen, phosphorus, and pH level using a machine learning model.
- **User Authentication**: Secure login and registration system.
- **RESTful APIs**: Built with Node.js and integrated with a Python-based AI model.
- **Dynamic Content**: Uses Handlebars.js for rendering dynamic web pages.

## Tech Stack

- **Frontend**: HTML, CSS (Tailwind), JavaScript, Bootstrap
- **Backend**: Node.js, Express.js
- **Machine Learning**: Python (Scikit-Learn), Jupyter Notebooks
- **Database**: MongoDB
- **Authentication**: OAuth, Passport.js
- **Templating Engine**: Handlebars.js

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sub-mist/EasyFarm.git
   cd EasyFarm

Install dependencies:
npm install

Set up environment variables:
-Create a .env file in the root directory.
-Add the necessary environment variables such as database connection strings, API keys, etc.

Run the application:
npm start
-Access the application in your web browser at http://localhost:3000.

Usage:
-Navigate to the dashboard to view temperature, humidity, and windspeed graphs.
-Use the Crop Recommendation feature by providing inputs for potassium, temperature, humidity, rainfall, nitrogen, phosphorus, and pH level.
-Log in or register to access personalized features.

## File Structure:
```plaintext
EasyFarm/
├── ai_model/
│   ├── datasets/
│   │   └── Crop_recommendation.csv
│   ├── notebooks/
│   │   └── Crop_Recommendation.ipynb
│   └── trained_models/
│       └── Crop_Recommendation.pkl
├── public/
│   ├── css/
│   │   └── registration.css
│   ├── images/
│   └── js/
│       └── registration.js
├── src/
│   ├── database/
│   │   └── databaseConnection.js
│   ├── goauth/
│   │   └── passport.js
│   ├── middleware/
│   │   └── auth.js
│   ├── model/
│   ├── python_scripts/
│   ├── routers/
│   │   └── userScreenRoute.js
│   └── server.js
├── templates/
│   ├── partials/
│   │   ├── cityoptions.hbs
│   │   ├── devinfo.hbs
│   │   ├── footer.hbs
│   │   └── navbar.hbs
│   └── views/
│       ├── about.hbs
│       ├── aboutus.hbs
│       ├── contactus.hbs
│       ├── environmentmonitor.hbs
│       ├── home.hbs
│       ├── imageprocess.hbs
│       ├── index.hbs
│       ├── iprocessresults.hbs
│       ├── price.hbs
│       ├── privacypolicy.hbs
│       ├── registration.hbs
│       ├── services.hbs
│       ├── sessionout.hbs
│       ├── soil.hbs
│       ├── soilinput.hbs
│       └── tandc.hbs
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── README.txt

```


## Contributing:
   -Fork the repository.
   -Create a new branch (git checkout -b feature-branch).
   -Commit your changes (git commit -m 'Add some feature').
   -Push to the branch (git push origin feature-branch).
   -Open a pull request.
