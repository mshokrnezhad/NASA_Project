const mongoose = require("mongoose");
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
    console.log("MongoDB connection is ready!");
});
mongoose.connection.on("error", (error) => {
    console.log(error);
});

async function connectToMongodb() {
    await mongoose.connect(MONGO_URL, {
        /* useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true */
    });
};

async function disconnectFromMongodb() {
    await mongoose.disconnect();
};

module.exports = { connectToMongodb, disconnectFromMongodb };