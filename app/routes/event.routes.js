module.exports = (app) => {
  const eventController = require("../controllers/event.controller");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new Event
  router.post("/", [authenticate], eventController.createEvent);

  // Retrieve a single Event
  router.get("/:id", [authenticate], eventController.getEventById);

  // Retrieve all Events
  router.get("/", [authenticate], eventController.getAllEvents);

  // Update one Event
  router.put("/:id", [authenticate], eventController.updateEvent);

  // Delete one Event
  router.delete("/:id", [authenticate], eventController.deleteEvent);

  app.use("/flight-plan-t4/events", router);
};
