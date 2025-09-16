require("dotenv").config();
const User = require('../models/user');
const Product = require('../models/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log("User already exists");
            return {
                EC: 1,
                EN: "User already exists"
            };
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let result = await User.create({ name, email, password: hashedPassword, role: "user" });

        return result;
    } catch (error) {
        console.log("Error creating user:", error);
        return {
            EC: 2,
            EN: "User creation failed"
        };
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


const addToFavorites = async (email, productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) return {
            EC: 1,
            EN: "Product not found"
        };

        const user = await User.findOneAndUpdate(
            { email },
            { $addToSet: { favorites: productId } },
            { new: true }
        ).populate("favorites");

        if (!user) return {
            EC: 1,
            EN: "User not found"
        };

        return {
            EC: 0,
            EN: "Added to favorites",
            favorites: user.favorites
        };
    } catch (err) {
        return {
            EC: 2,
            EN: err.message
        };
    }
};

const removeFromFavorites = async (email, productId) => {
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { $pull: { favorites: productId } },
            { new: true }
        ).populate("favorites");

        if (!user) return {
            EC: 1,
            EN: "User not found"
        };

        return {
            EC: 0,
            favorites: user.favorites
        };
    } catch (err) {
        return {
            EC: 2,
            EN: err.message
        };
    }
};

const getAllFavorites = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return {
            EC: 1,
            EN: "User not found"
        };

        return {
            EC: 0,
            favorites: user.favorites.map(id => id.toString())
        };
    } catch (err) {
        return {
            EC: 2,
            EN: err.message
        };
    }
};

const getViewedProducts = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return {
            EC: 1,
            EN: "User not found"
        };

        return {
            EC: 0,
            viewed: user.viewed.map(id => id.toString())
        };
    } catch (err) {
        return {
            EC: 2,
            EN: err.message
        };
    }
};

const addViewedProduct = async (email, productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) return {
            EC: 1,
            EN: "Product not found"
        };

        product.views = (product.views || 0) + 1;
        await product.save();

        const user = await User.findOneAndUpdate(
            { email },
            { $addToSet: { viewed: productId } },
            { new: true }
        );
        if (!user) return {
            EC: 1,
            EN: "User not found"
        };

        return {
            EC: 0,
            viewed: user.viewed
        };
    } catch (err) {
        return {
            EC: 2,
            EN: err.message
        };
    }
};

module.exports = {
    createUserService,
    loginService,
    getUserService,
    addToFavorites,
    removeFromFavorites,
    getAllFavorites,
    getViewedProducts,
    addViewedProduct
};
