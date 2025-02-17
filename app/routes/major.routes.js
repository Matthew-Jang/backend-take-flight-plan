module.exports = (app) => {
    const major = require("../controllers/major.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new Major.
    router.post("/", [authenticate], major.create);
  
    // Retrieve all Majors.
    router.get("/", [authenticate], major.findAll);
  
    // Retrieve a single Major with id.
    router.get("/:id", [authenticate], major.findOne);
  
    // Update a Major with id.
    router.put("/:id", [authenticate], major.update);
  
    // Delete a Major with id.
    router.delete("/:id", [authenticate], major.delete);
  
    // Delete all Majors.
    router.delete("/", [authenticate], major.deleteAll);
  
    app.use("/flight-plan-t4/majors", router);
  };
  