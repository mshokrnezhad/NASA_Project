const fs = require("fs")
const planets = require("../routers/planets/planets.mongo")
const { parse } = require("csv-parse");
const path = require("path")

const isHabitablePlanet = (planet) => {
    return planet["koi_disposition"] === "CONFIRMED"
        && planet["koi_insol"] > 0.36
        && planet["koi_insol"] < 1.11
        && planet["koi_prad"] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv"))
            .pipe(parse({
                comment: "#",
                columns: true
            }))
            .on("data", async data => {
                if (isHabitablePlanet(data)) {
                    await savePlanet(data);
                }
            })
            .on('error', error => {
                comsole.log(error);
                reject();
            })
            .on("end", async () => {
                const numPlanets = (await getAllPlanets()).length
                console.log(`The number of habitable planets is ${numPlanets}.`)
                resolve();
            });
    })
}

async function getAllPlanets() {
    return await planets.find(
        {},
        {
            "_id": 0,
            "__v": 0
        }
    );
}

async function savePlanet(data) {
    try {
        await planets.updateOne(
            {
                keplerName: data.kepler_name,
            },
            {
                keplerName: data.kepler_name,
            },
            {
                upsert: true
            });
    }
    catch (error) {
        console.error(`Saving planets failed: ${error}`)
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}