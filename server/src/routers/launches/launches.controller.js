const { getAllLaunches, addNewLaunch, checkLaunchIdAvailable, deleteLaunch } = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpPostNewLaunch(req, res) {
    const launch = req.body;

    console.log(launch)

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
        return res.status(400).json({
            error: "Missing required launch property!"
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch date!"
        });
    }

    await addNewLaunch(launch)
    return res.status(201).json(launch);
}

async function httpDeleteLaunch(req, res) {
    const launchId = Number(req.params.id);
    const isLaunchIdAvailable = await checkLaunchIdAvailable(launchId);

    if (!isLaunchIdAvailable) {
        return res.status(404).json({
            error: "Invalid launch ID!"
        });
    }

    const aborted = await deleteLaunch(launchId);
    if(!aborted){
        res.status(400).json({
            error: "deleting launch is failed."
        });
    }
    return res.status(200).json({
        ok: true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpPostNewLaunch,
    httpDeleteLaunch
};