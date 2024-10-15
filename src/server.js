import 'dotenv/config';
import express from "express";
import path from "path";
import { fileURLToPath } from 'url'; // This is needed to replace __dirname in ES6
import hbs from "hbs";
import cookieParser from 'cookie-parser';
import axios from 'axios';
import passport from 'passport';
import session from 'express-session';
import router from "./routers/userScreenRoute.js"; // Importing your router (notice the .js extension in ES6)

import './goauth/passport.js';
import './database/databaseConnection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const parttials_path = path.join(__dirname, "../templates/parttials");

const PORT = process.env.PORT || 8000;

const app = express();

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
    if (process.env.IPV6_MODE === 'true') {
        const publicIPv6 = await getPublicIPv6();
        if (publicIPv6) {
            const url = `http://[${publicIPv6}]:${PORT}/`;
            console.log(url);
            openWebApp(url);
            const { default: clipboardy } = await import('clipboardy');
            clipboardy.writeSync(url);
            console.log("URL copied to clipboard");
        } else {
            console.log("Could not retrieve IPv6, falling back to localhost");
            openWebApp(`http://localhost:${PORT}/`);
        }
    } else {
        const url = `http://localhost:${PORT}/`;
        console.log(url);
        openWebApp(url);
    }
});

const openWebApp = async (url) => {
    const { default: open } = await import('open');
    open(url);
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
