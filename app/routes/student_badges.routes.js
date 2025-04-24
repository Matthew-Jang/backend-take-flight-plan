// routes/badge.routes.js
const ctrl = require("../controllers/student_badge.controller.js");
module.exports = app => {
  const router = require("express").Router();
  router.post("/award", ctrl.award);
  router.get("/", ctrl.listForStudent);
  app.use("/flight-plan-t4/student_badges", router);
};
