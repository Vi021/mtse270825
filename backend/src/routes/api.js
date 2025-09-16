const express = require('express');
const auth = require("../middleware/auth");
const delay = require('../middleware/delay');
const UserController = require('../controller/userController');
const ProductController = require('../controller/productController');

const routerAPI = express.Router();

routerAPI.use(auth);
routerAPI.get("/", (req, res) => {
    return res.status(200).json({ message: "Hello from API" });
});

routerAPI.post('/register', UserController.createUser);
routerAPI.post('/login', UserController.handleLogin);

routerAPI.get('/account', delay, UserController.getAccount);
routerAPI.get('/user', UserController.getUser);

routerAPI.post('/user/:email/favorites/:productId', UserController.addToFavorites);
routerAPI.delete('/user/:email/favorites/:productId', UserController.removeFromFavorites);
routerAPI.get('/user/:email/favorites', UserController.getAllFavorites);
routerAPI.get('/user/:email/viewed', UserController.getViewedProducts);
routerAPI.post('/user/:email/viewed/:productId', UserController.addViewedProduct);



routerAPI.get("/products", ProductController.getProducts);        // lazy loading + filters
routerAPI.get("/products/:id", ProductController.getProductById);
routerAPI.post("/products/add", ProductController.createProduct);
routerAPI.put("/products/update/:id", ProductController.updateProduct);
routerAPI.delete("/products/remove/:id", ProductController.deleteProduct);
routerAPI.get("/products/similar/:id", ProductController.getSimilarProducts);


module.exports = routerAPI;
