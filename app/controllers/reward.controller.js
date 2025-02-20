const db = require("../models");
const Reward = db.reward;

// Create a new reward
exports.createReward = async (req, res) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rewards
exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.findAll();
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reward by ID
exports.getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findByPk(req.params.id);
    if (!reward) return res.status(404).json({ message: "Reward not found" });
    res.status(200).json(reward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a reward
exports.updateReward = async (req, res) => {
  try {
    const updated = await Reward.update(req.body, {
      where: { reward_id: req.params.id },
    });
    if (updated[0] === 0) return res.status(404).json({ message: "Reward not found" });
    res.status(200).json({ message: "Reward updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a reward
exports.deleteReward = async (req, res) => {
  try {
    const deleted = await Reward.destroy({
      where: { reward_id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Reward not found" });
    res.status(200).json({ message: "Reward deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
