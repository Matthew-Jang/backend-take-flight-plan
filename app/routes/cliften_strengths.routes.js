const express = require("express");
const router = express.Router();
const cliftonStrengthController = require("../controllers/clifton_strengths.controller");

// Routes for Clifton Strengths
router.post("/", cliftonStrengthController.createStrength);
router.get("/", cliftonStrengthController.getAllStrengths);
router.get("/:id", cliftonStrengthController.getStrengthById);
router.put("/:id", cliftonStrengthController.updateStrength);
router.delete("/:id", cliftonStrengthController.deleteStrength);

module.exports = router;
