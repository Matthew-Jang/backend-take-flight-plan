const { authenticate } = require("../authorization/authorization.js");
const controller = require("../controllers/flight_plan_item.controller.js");

module.exports = (app) => {
  const router = require("express").Router();

  // Create a new student-checklist link
  router.post("/", [authenticate], controller.create);

  // Retrieve all (optionally filter by ?student_id=)
  router.get("/", [authenticate], controller.findAll);

  // Retrieve one by id
  router.get("/:id", [authenticate], controller.findOne);

  // Update one by id
  router.put("/:id", [authenticate], controller.update);

  // Delete one by id
  router.delete("/:id", [authenticate], controller.delete);

  // Delete all
  router.delete("/", [authenticate], controller.deleteAll);

  // Mount at /flight-plan-t4/student_checklist_items
  app.use("/flight-plan-t4/flight_plan_items", router);
};
