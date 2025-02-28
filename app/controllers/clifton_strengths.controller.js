const db = require("../models");
const CliftonStrength = db.cliftonStrength;

// Create a new Clifton Strength
exports.createStrength = async (req, res) => {
  try {
    const strength = await CliftonStrength.create(req.body);
    res.status(201).json(strength);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Clifton Strengths
exports.getAllStrengths = async (req, res) => {
  try {
    const strengths = await CliftonStrength.findAll();
    res.status(200).json(strengths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Clifton Strength by ID
exports.getStrengthById = async (req, res) => {
  try {
    const strength = await CliftonStrength.findByPk(req.params.id);
    if (!strength) return res.status(404).json({ message: "Strength not found" });
    res.status(200).json(strength);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Clifton Strength
exports.updateStrength = async (req, res) => {
  try {
    const updated = await CliftonStrength.update(req.body, {
      where: { clifton_strengths_id: req.params.id },
    });
    if (updated[0] === 0) return res.status(404).json({ message: "Strength not found" });
    res.status(200).json({ message: "Strength updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Clifton Strength
exports.deleteStrength = async (req, res) => {
  try {
    const deleted = await CliftonStrength.destroy({
      where: { clifton_strengths_id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Strength not found" });
    res.status(200).json({ message: "Strength deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
