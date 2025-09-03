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
routerAPI.get('/account', delay, getAccount);


// fake data
const products = Array.from({ length: 200 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
routerAPI.get('/products', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let start = (page - 1) * limit;
    let end = start + limit;
    
    res.status(200).json({
        page,
        limit,
        total: products.length,
        data: products.slice(start, end)
    });
});

module.exports = routerAPI;
