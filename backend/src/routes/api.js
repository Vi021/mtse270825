const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controller/userController');
const auth = require("../middleware/auth");
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.use(auth);
routerAPI.get("/", (req, res) => {
    return res.status(200).json({ message: "Hello from API" });
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);

routerAPI.get('/user', getUser);
routerAPI.get('/account', getAccount);

module.exports = routerAPI;
