const UserService = require("../services/userService");


const createUser = async (req, res) => {
    const { name, email, password } = req.body;    
    const user = await UserService.createUserService(name, email, password);

    if (!user) {
        return res.status(400).json({ message: "User creation failed" });
    }

    return res.status(200).json(user);
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const result = await UserService.loginService(email, password);

    return res.status(200).json(result);
};

const getUser = async (req, res) => {
    const users = await UserService.getUserService();

    return res.status(200).json(users);
};

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
};


// success: 0
// not found: 1
// server error: 2
const responseBuilder = (res, code, message, data = null) => {
    const statusCodes = {
        0: 200,
        1: 404,
        2: 500
    };

    const responses = {
        0: { success: true, data },
        1: { success: false, message },
        2: { success: false, message }
    };

    return res.status(statusCodes[code]).json(responses[code]);
};

const addToFavorites = async (req, res) => {
    const { email, productId } = req.params;
    const result = await UserService.addToFavorites(email, productId);
    responseBuilder(res, result.EC, result.EN, result.favorites);
};

const removeFromFavorites = async (req, res) => {   
    const { email, productId } = req.params;
    const result = await UserService.removeFromFavorites(email, productId);
    responseBuilder(res, result.EC, result.EN, result.favorites);
};

const getAllFavorites = async (req, res) => {
    const { email } = req.params;
    const result = await UserService.getAllFavorites(email);
    responseBuilder(res, result.EC, result.EN, result.favorites);
};

const getViewedProducts = async (req, res) => {
    const { email } = req.params;
    const result = await UserService.getViewedProducts(email);
    responseBuilder(res, result.EC, result.EN, result.viewed);
};

const addViewedProduct = async (req, res) => {
    const { email, productId } = req.params;
    const result = await UserService.addViewedProduct(email, productId);
    responseBuilder(res, result.EC, result.EN, result.viewed);
};

module.exports = {
    createUser,
    handleLogin: loginUser,
    getUser,
    getAccount,
    addToFavorites,
    removeFromFavorites,
    getAllFavorites,
    getViewedProducts,
    addViewedProduct
};
