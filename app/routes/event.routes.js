module.exports = (app) => {
  const eventController = require("../controllers/event.controller");
  const { authenticate, requireAdmin } = require("../authorization/authorization.js");
  const router = require("express").Router();

  // — Student signup endpoints —
  // Get this user’s signup list
  router.get(
    "/signups/me",
    [authenticate],
    eventController.getMySignups
  );
  router.delete("/:id/signup/:userId", authenticate, eventController.unSignupForEventAdmin);

  // Sign up for an event
  router.post(
    "/:id/signup",
    [authenticate],
    eventController.signupForEvent
  );
  // Un-sign (unregister) from an event
  router.delete(
    "/:id/signup",
    [authenticate],
    eventController.unSignupForEvent
  );

  // — Admin signup view —
  // List all signups for a given event
  router.get(
    "/:id/signups",
    [authenticate, requireAdmin],
    eventController.getEventSignups
  );

  // — Event CRUD —
  router.post("/",           [authenticate, requireAdmin], eventController.createEvent);
  router.get("/",            [authenticate], eventController.getAllEvents);
  router.get("/:id",         [authenticate], eventController.getEventById);
  router.put("/:id",         [authenticate, requireAdmin], eventController.updateEvent);
  router.delete("/:id",      [authenticate, requireAdmin], eventController.deleteEvent);

  app.use("/flight-plan-t4/events", router);
};
