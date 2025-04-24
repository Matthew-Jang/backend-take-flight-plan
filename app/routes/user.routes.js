// routes/user.routes.js

module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const { authenticate, requireAdmin } = require("../authorization/authorization.js");
  const router = require("express").Router();

  // Get the current authenticated user's info
  router.get("/me", authenticate, user.getCurrentUser);

  // Create a new User
  router.post("/", authenticate, user.create);

  // Retrieve all Users
  router.get("/", authenticate, user.findAll);

  // Retrieve a single User by id
  router.get("/:id", authenticate, user.findOne);

  // Update a User by id (admin only)
  router.put("/:id", [authenticate, requireAdmin], user.update);

  // Delete a User by id (admin only)
  router.delete("/:id", [authenticate, requireAdmin], user.delete);

  // Delete all Users (admin only)
  router.delete("/", [authenticate, requireAdmin], user.deleteAll);

  // Modify a Student's points (admin only)
  router.patch("/:id/points", [authenticate, requireAdmin], user.modifyPoints);

  app.use("/flight-plan-t4/users", router);
};
