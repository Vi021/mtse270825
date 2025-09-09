const express = require('express');
const auth = require("../middleware/auth");
const delay = require('../middleware/delay');
const { createUser, handleLogin, getUser, getAccount } = require('../controller/userController');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controller/productController');

const routerAPI = express.Router();

routerAPI.use(auth);
routerAPI.get("/", (req, res) => {
    return res.status(200).json({ message: "Hello from API" });
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);

routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);


routerAPI.get("/products", getProducts);        // lazy loading + filters
routerAPI.get("/products/:id", getProductById);
routerAPI.post("/products/add", createProduct);
routerAPI.put("/products/update/:id", updateProduct);
routerAPI.delete("/products/remove/:id", deleteProduct);

module.exports = routerAPI;
