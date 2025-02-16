const auth = require("../authorization/authorization.js");

module.exports = (app) => {
    const checklist_items = require("../controllers/checklist_item.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    //Create a new Checklist Item
    router.post("/", [authenticate], checklist_items.create);

    // Retrieve a single Checklist Item
    router.get("/:id", [authenticate], checklist_items.findOne);

    // Retrieve all Checklist Items
    router.get("/", [authenticate], checklist_items.findAll);

    // Update one Checklist Item
    router.put("/:id", [authenticate], checklist_items.update);

    // Delete one Checklist Item
    router.delete("/:id", [authenticate], checklist_items.delete);

    // Delete all Checklist Items
    router.delete("/", [authenticate], checklist_items.deleteAll);

    app.use("/flight-plan-t4/checklist_items", router);
};