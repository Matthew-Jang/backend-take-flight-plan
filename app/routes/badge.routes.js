const badge = require("../controllers/badge.controller.js");
const { authenticate } = require("../authorization/authorization.js");
var router = require("express").Router();

module.exports = (app) => {
  // Create a new Badge
  router.post("/", [authenticate], badge.create);

  // Retrieve all badges
  router.get("/", [authenticate], badge.findAll);

  // Retrieve a single badge by id
  router.get("/:id", [authenticate], badge.findOne);

  // Update a badge by id
  router.put("/:id", [authenticate], badge.update);

  // Delete a badge by id
  router.delete("/:id", [authenticate], badge.delete);

  // Delete all badges
  router.delete("/", [authenticate], badge.deleteAll);

  app.use("/flight-plan-t4/badges", router);
};




  