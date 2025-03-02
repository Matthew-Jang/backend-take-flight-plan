module.exports = (app) => {
const express = require("express");
const router = express.Router();
const rewardController = require("../controllers/reward.controller");

// Routes for rewards
router.post("/", rewardController.createReward);
router.get("/", rewardController.getAllRewards);
router.get("/:id", rewardController.getRewardById);
router.put("/:id", rewardController.updateReward);
router.delete("/:id", rewardController.deleteReward);

app.use("/flight-plan-t4/rewards", router);
};