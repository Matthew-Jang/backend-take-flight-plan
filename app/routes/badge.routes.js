const badge = require("../controllers/badge.controller.js");
const { authenticate, requireAdmin } = require("../authorization/authorization.js");
var router = require("express").Router();

module.exports = (app) => {
  // Create a new Badge
  router.post("/", [authenticate, requireAdmin], badge.create);

  // Retrieve all badges
  router.get("/", [authenticate], badge.findAll);

  // Retrieve a single badge by id
  router.get("/:id", [authenticate], badge.findOne);

  // Update a badge by id
  router.put("/:id", [authenticate, requireAdmin], badge.update);

  // Delete a badge by id
  router.delete("/:id", [authenticate, requireAdmin], badge.delete);

  // Delete all badges
  router.delete("/", [authenticate, requireAdmin], badge.deleteAll);

  app.use("/flight-plan-t4/badges", router);
};




  