require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

const db = require("./app/models");

db.sequelize.sync();

var corsOptions = {
  origin: ["http://localhost:8081", "http://flightplan.eaglesoftwareteam.com"],
  credentials: true
};

app.use(cors(corsOptions));
// app.options("*", cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

/*** Importing Routes ***/
// core routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// Close user info
require("./app/routes/student.routes")(app);
require("./app/routes/badge.routes")(app);
require("./app/routes/major.routes")(app);
require("./app/routes/clifton_strengths.routes")(app);

// Tasks, Experiences, Points, Rewards
require("./app/routes/checklist_item.routes")(app);
require("./app/routes/event.routes")(app);
require("./app/routes/reward.routes")(app); 

// set port, listen for requests
const PORT = process.env.PORT || 3100;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;
