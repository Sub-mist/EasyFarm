import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        required: false,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

// Generating Auth Token
userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        
        this.tokens = this.tokens.concat({ token });
        await this.save();
        
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
    }
};

// Password hashing before saving
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined;
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
