const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const app = express();
const planetsRouter = require("./routers/planets/planets.router");
const launchesRouter = require("./routers/launches/launches.router")

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(morgan("combined"));
app.use(express.json());

app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
}) //  "/*" serves anything which doesn't match with the routers

module.exports = app;
