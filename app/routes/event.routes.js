module.exports = (app) => {
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

// Routes for events
router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

app.use("/flight-plan-t4/events", router);
};