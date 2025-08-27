require('dotenv').config();
const mongoose = require('mongoose');

const dbState = [{
    value: 0,
    label: 'Disconnected'
}, {
    value: 1,
    label: 'Connected'
}, {
    value: 2,
    label: 'Connecting'
}, {
    value: 3,
    label: 'Disconnecting'
}];


const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        const state = Number(mongoose.connection.readyState);
        console.log(dbState.find(e => e.value === state).label, "to database");
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connection;