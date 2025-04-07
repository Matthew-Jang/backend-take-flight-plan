const db = require("../models");
const Flight_Plan_Item = db.flight_plan_item;
const Op = db.Sequelize.Op;

// Create and Save a new Flight Plan Item
exports.create = (req, res) => {

  const fpi = {
    checklist_item_id: req.body.checklist_item_id,
    semester_number: req.body.semester_number,         
  };

  Flight_Plan_Item.create(fpi)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Error creating Flight Plan Item",
      })
    );
};

// Retrieve all Flight Plan Items (optionally filter by checklist_item_id or semester)
exports.findAll = (req, res) => {
  const { checklist_item_id, semester_number } = req.query;
  const where = {};
  if (checklist_item_id) where.checklist_item_id = { [Op.eq]: checklist_item_id };
  if (semester_number)  where.semester_number  = { [Op.eq]: semester_number };

  Flight_Plan_Item.findAll({ where })
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Error retrieving Flight Plan Items",
      })
    );
};

// Retrieve a single Flight Plan Item by ID
exports.findOne = (req, res) => {
  const id = req.params.id;
  Flight_Plan_Item.findByPk(id)
    .then((data) => {
      if (data) res.send(data);
      else
        res.status(404).send({
          message: `Flight Plan Item not found with id=${id}`,
        });
    })
    .catch((err) =>
      res.status(500).send({
        message: err.message || `Error retrieving id=${id}`,
      })
    );
};

// Update a Flight Plan Item by ID
exports.update = (req, res) => {
  const id = req.params.id;
  Flight_Plan_Item.update(req.body, { where: { id } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Flight Plan Item updated successfully." });
      } else {
        res.send({ message: `Cannot update id=${id}. Maybe not found or no changes.` });
      }
    })
    .catch((err) =>
      res.status(500).send({
        message: err.message || `Error updating id=${id}`,
      })
    );
};

// Delete a Flight Plan Item by ID
exports.delete = (req, res) => {
  const id = req.params.id;
  Flight_Plan_Item.destroy({ where: { id } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Flight Plan Item deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete id=${id}. Maybe not found.` });
      }
    })
    .catch((err) =>
      res.status(500).send({
        message: err.message || `Error deleting id=${id}`,
      })
    );
};

// Delete all Flight Plan Items
exports.deleteAll = (req, res) => {
  Flight_Plan_Item.destroy({ where: {}, truncate: false })
    .then((nums) =>
      res.send({ message: `${nums} Flight Plan Item(s) deleted successfully!` })
    )
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Error deleting all Flight Plan Items",
      })
    );
};
