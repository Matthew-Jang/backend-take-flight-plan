// app/routes/student_flight_plan_item.routes.js

const { authenticate } = require("../authorization/authorization.js");
const ctrl            = require("../controllers/student_flight_plan_item.controller.js");
const multer          = require("multer");
const upload          = multer({ dest: "uploads/" });

module.exports = app => {
  const router = require("express").Router();

  // Student generates their full plan
  router.post("/generate",     [authenticate],               ctrl.generate);
  // List / filter / include
  router.get("/",              [authenticate],               ctrl.findAll);
  // Single item
  router.get("/:id",           [authenticate],               ctrl.findOne);
  // Student completes (multipart w/ file)
  router.put("/:id/complete",  [authenticate, upload.single("file")], ctrl.complete);
  // Admin approves/denies or any update
  router.put("/:id",           [authenticate],               ctrl.update);
  // Delete one
  router.delete("/:id",        [authenticate],               ctrl.delete);
  // Delete all
  router.delete("/",           [authenticate],               ctrl.deleteAll);

  app.use("/flight-plan-t4/student_flight_plan_items", router);
};
