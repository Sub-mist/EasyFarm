const jwt = require('jsonwebtoken');
const User = require('../model/userInfoSchema');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: verifyUser._id });

        req.token = token;
        req.user = user;

        next();
        
    } catch (error) {
        res.status(401);
        res.render("sessionout.hbs", {
            msg: "Session ends, go back to home"
        });
    }
}

module.exports = auth;
