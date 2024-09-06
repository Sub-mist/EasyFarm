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
    console.log(`http://localhost:${PORT}/`);
    const publicipv6 = await getPublicIPv6();
    console.log(`http://[${publicipv6}]:${PORT}/`);
    openWebApp();
    
});

const openWebApp = async (publicipv6) => {
    const open = await import('open');
    if (publicipv6) {
        open.default(`http://[${publicipv6}]:${PORT}/`);
    } else {
        open.default(`http://localhost:${PORT}`);
    }
}

const getPublicIPv6 = async () => {
    try {
        const response = await axios.get('https://ipv6.icanhazip.com');
        const ipv6 = response.data.trim();
        return ipv6;
    } catch (error) {
        console.error('Error fetching the IPv6 address:', error);
    }
}
