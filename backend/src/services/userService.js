require("dotenv").config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log("User already exists");
            return null;
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let result = await User.create({ name, email, password: hashedPassword, role: "user" });
        return result;
    } catch (error) {
        console.log("Error creating user:", error);
        return null;
    }
};

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return {
                EC: 1,
                EN: "Invalid Email/Password"
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                EC: 2,
                EN: "Password unmatched"
            };
        }

        const token = jwt.sign(
            { email: user.email, name: user.name }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRATION }
        );
        
        return { 
            EC: 0,
            token,
            user: {
                email: user.email,
                name: user.name
            }
        };
    } catch (error) {
        console.log("Error logging in:", error);
        return null;
    }
};

const getUserService = async () => {
    try {
        let result = await User.find({}, '-password -__v');
        return result;
    } catch (error) {
        console.log("Error fetching users:", error);
        return null;
    }
};

module.exports = {
    createUserService,
    loginService,
    getUserService
};
