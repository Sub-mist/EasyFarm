const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true, 
        unique: true, 
    },
    password: {
        type: String,
        //required: true, 
    },
    confirmPassword: {
        type: String,
    },
    imagePath: {
        type: String,
        default: "",
        required:false 
    },
    tokens: [{
        token: {
            type: String,
            required: true, 
        }
    }]
});

userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        
        this.tokens = this.tokens.concat({ token: token });
        
        await this.save();
        
        return token;
    } catch (error) {
        res.send("the error part" + error);
        console.log("the error part" + error); 
    }
}

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        
        this.confirmPassword = undefined;
    }
    next();
})

const User = new mongoose.model("User", userSchema);

module.exports = User;
