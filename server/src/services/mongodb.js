const mongoose = require("mongoose");
const MONGO_URL = "mongodb+srv://mshokrnezhad:mS-92131910@nasadb.ye1vi.mongodb.net/NASADB?retryWrites=true&w=majority";

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