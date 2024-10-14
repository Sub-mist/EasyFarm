require('dotenv').config();

const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const cookieParser = require('cookie-parser');
const axios = require('axios');
const router = require("./routers/userScreenRoute");
const passport = require('passport');
const session = require('express-session');

require('./goauth/passport');
require("./database/databaseConnection");
  
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const parttials_path = path.join(__dirname, "../templates/parttials");

const PORT = process.env.PORT || 8000;

app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(parttials_path);

app.use(express.static(static_path));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.listen(PORT, async () => {
    console.log("\n\n\nserver is running at :");
    if(process.env.IPV6_MODE === 'true') {
        const publicIPv6 = await getPublicIPv6();
        if(publicIPv6) {
            const url = `http://[${publicIPv6}]:${PORT}/`;
            console.log(url);
            openWebApp(url);
            const clipboardyModule = await import('clipboardy');
            const clipboardy = clipboardyModule.default;
            clipboardy.writeSync(url);
            console.log("URL copied to clipboard");
        } else {
            console.log("Could not retrive IPv6, falling back to localhost");
            openWebApp(`http://localhost:${PORT}/`);
        } 
    } else {
        const url = `http://localhost:${PORT}/`
        console.log(url);
        openWebApp(url);
    }
});

const openWebApp = async (url) => {
    const open = await import('open');
    open.default(url);
}

const getPublicIPv6 = async () => {
    try {
        const response = await axios.get('https://ipv6.icanhazip.com');
        const ipv6 = response.data.trim();
        return ipv6;
    } catch (error) {
        console.error('Error fetching the IPv6 address:', error);
        return null;
    }
}
