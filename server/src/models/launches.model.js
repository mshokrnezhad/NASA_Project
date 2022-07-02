const axios = require("axios");
const launches = require("../routers/launches/launches.mongo");
const planets = require("../routers/planets/planets.mongo");
const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

const launch = {
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    destination: "Kepler-442 b",
    customers: ["MadMas", "NASA"],
    upcoming: true,
    success: true
};

async function loadLaunchesData() {
    console.log("loading launches data is started...");

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        mission: "FalconSat",
        rocket: "Falcon 1"
    });

    if (firstLaunch) {
        console.log("launches data is already loaded!");
    }
    else {
        await populateLaunches();
    };
};

async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    if (response.status !== 200) {
        console.log("downloading launches data is failed!");
        throw new Error("downloading launches data is failed!");
    }

    response.data.docs.map((launchData) => {
        /* let customers = [];
        launchData["payloads"].map((payload) => {
            customers.push(payload["customers"][0]);
        }); */

        const customers = launchData["payloads"].flatMap(((payload) => {
            return payload["customers"];
        }));

        const newLaunch = {
            flightNumber: launchData["flight_number"],
            mission: launchData["name"],
            rocket: launchData["rocket"]["name"],
            launchDate: launchData["date_local"],
            upcoming: launchData["upcoming"],
            success: launchData["success"],
            customers: customers
        }

        console.log(newLaunch["flightNumber"], newLaunch["rocket"], newLaunch["customers"]);

        saveLaunch(newLaunch);
    });
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

async function findLaunch(filter) {
    return await launches.findOne(filter);
};

async function checkLaunchIdAvailable(launchId) {
    return await findLaunch({
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
    const planet = await planets.findOne({
        keplerName: launch.destination
    });

    if (!planet) {
        throw new Error("No matching planet found!");
    }

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
    loadLaunchesData,
    getAllLaunches,
    addNewLaunch,
    checkLaunchIdAvailable,
    deleteLaunch
};