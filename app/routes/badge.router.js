//  for badge

module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new Badge
  router.post("/", [authenticate], user.create);

  // Retrieve all badges
  router.get("/", [authenticate], user.findAll);

  // Retrieve a single badge by id
  router.get("/:id", [authenticate], user.findOne);

  // Update a badge by id
  router.put("/:id", [authenticate], user.update);

  // Delete a badge by id
  router.delete("/:id", [authenticate], user.delete);

  // Delete all badges
  router.delete("/", [authenticate], user.deleteAll);

  app.use("/flight-plan-t4/badges", router);
};




  