const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model")
const PORT = process.env.PORT || 8000;
const MONGO_URL = "mongodb+srv://mshokrnezhad:mS-92131910@nasadb.ye1vi.mongodb.net/NASADB?retryWrites=true&w=majority";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
    console.log("MongoDB connection is ready!");
});
mongoose.connection.on("error", (error) => {
    console.log(error);
});

async function startServer() {
    await mongoose.connect(MONGO_URL, {
        /* useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true */
    });
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}...`)
    })
}

startServer();


