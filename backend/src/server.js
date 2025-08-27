require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const getHomePage = require('./controller/homeController');
const cors = require('cors');


const app = express();  // cấu hình app là express
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

const webAPI = express.Router();
webAPI.get('/', getHomePage);
app.use('/', webAPI);
app.use('/api', apiRoutes);
(async () => {
    try {
        await connection();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();
