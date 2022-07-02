const launches = require("../routers/launches/launches.mongo");
const planets = require("../routers/planets/planets.mongo");
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    destination: "Kepler-442 b",
    customer: ["MadMas", "NASA"],
    upcoming: true,
    success: true
};

saveLaunch(launch);

async function getAllLaunches() {
    return await launches.find(
        {},
        {
            "_id": 0,
            "__v": 0
        }
    );
}

async function checkLaunchIdAvailable(launchId) {
    return await launches.findOne({
        flightNumber: launchId
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches.findOne().sort("-flightNumber");

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    };

    return latestLaunch.flightNumber;
}

async function saveLaunch(data) {
    const planet = await planets.findOne({
        keplerName: data.destination
    });

    if (!planet) {
        throw new Error("No matching planet found!");
    }

    await launches.findOneAndUpdate(
        {
            flightNumber: data.flightNumber
        },
        data,
        {
            upsert: true
        }
    );
};

async function addNewLaunch(launch) {
    const latestFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ["MadMas", "NASA"],
        flightNumber: latestFlightNumber
    });

    await saveLaunch(newLaunch);
}

async function deleteLaunch(launchId) {
    const aborted = await launches.updateOne(
        {
            flightNumber: launchId,
        },
        {
            success: false,
            upcoming: false
        });

    return aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    checkLaunchIdAvailable,
    deleteLaunch
};