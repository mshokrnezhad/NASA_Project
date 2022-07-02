const http = require("http");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model")
const { loadLaunchesData } = require("./models/launches.model");
const { connectToMongodb } = require("../src/services/mongodb");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await connectToMongodb();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}...`)
    })
}

startServer();


