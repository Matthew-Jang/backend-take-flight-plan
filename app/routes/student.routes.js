module.exports = (app) => {
  const students = require("../controllers/student.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  router.get("/user", [authenticate], students.findByUser);

  // Create a new Student
  router.post("/", [authenticate], students.create);

  // Retrieve a single Student by id
  router.get("/:id", [authenticate], students.findOne);

  // Retrieve all Students
  router.get("/", [authenticate], students.findAll);

  // Update a Student by id
  router.put("/:id", [authenticate], students.update);

  // Delete a Student by id
  router.delete("/:id", [authenticate], students.delete);

  // Delete all Students
  router.delete("/", [authenticate], students.deleteAll);

  app.use("/flight-plan-t4/students", router);
};
