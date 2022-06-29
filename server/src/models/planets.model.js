const fs = require("fs")
const { parse } = require("csv-parse");
const path = require("path")

const isHabitablePlanet = (planet) => {
    return planet["koi_disposition"] === "CONFIRMED"
        && planet["koi_insol"] > 0.36
        && planet["koi_insol"] < 1.11
        && planet["koi_prad"] < 1.6;
}

const results = [];

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv"))
            .pipe(parse({
                comment: "#",
                columns: true
            }))
            .on("data", data => {
                if (isHabitablePlanet(data)) {
                    results.push(data);
                }
            })
            .on('error', error => {
                comsole.log(error);
                reject();
            })
            .on("end", () => {
                console.log(`The number of habitable planets is ${results.length}.`)
                resolve();
            });
    })
}

function getAllPlanets() {
    return results;
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}