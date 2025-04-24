module.exports = (app) => {
  const rewardController = require("../controllers/reward.controller");
  const { authenticate, requireAdmin } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new Reward
  router.post("/", [authenticate, requireAdmin], rewardController.createReward);

  // Retrieve a single Reward
  router.get("/:id", [authenticate], rewardController.getRewardById);

  // Retrieve all Rewards
  router.get("/", [authenticate], rewardController.getAllRewards);

  // Update one Reward
  router.put("/:id", [authenticate, requireAdmin], rewardController.updateReward);

  // Delete one Reward
  router.delete("/:id", [authenticate, requireAdmin], rewardController.deleteReward);

  app.use("/flight-plan-t4/rewards", router);
};
