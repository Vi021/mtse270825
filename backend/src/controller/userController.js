const { createUserService, loginService, getUserService } = require("../services/userService");


const createUser = async (req, res) => {
    const { name, email, password } = req.body;    
    const user = await createUserService(name, email, password);

    return res.status(200).json(user);
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const result = await loginService(email, password);

    return res.status(200).json(result);
};

const getUser = async (req, res) => {
    const users = await getUserService();

    return res.status(200).json(users);
};

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
};

module.exports = {
    createUser,
    handleLogin: loginUser,
    getUser,
    getAccount
};
