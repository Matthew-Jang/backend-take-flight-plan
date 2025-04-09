module.exports = (app) => {
  const cliftonStrengthController = require("../controllers/clifton_strengths.controller");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new Clifton Strength
  router.post("/", [authenticate], cliftonStrengthController.createStrength);

  // Retrieve a single Clifton Strength
  router.get("/:id", [authenticate], cliftonStrengthController.getStrengthById);

  // Retrieve all Clifton Strengths
  router.get("/", [authenticate], cliftonStrengthController.getAllStrengths);

  // Update one Clifton Strength
  router.put("/:id", [authenticate], cliftonStrengthController.updateStrength);

  // Delete one Clifton Strength
  router.delete("/:id", [authenticate], cliftonStrengthController.deleteStrength);

  app.use("/flight-plan-t4/clifton_strengths", router);
};
