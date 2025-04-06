const db = require("../models");
const Student_Checklist_Item = db.student_checklist_item;
const Op = db.Sequelize.Op;

// Create and Save a new Student_Checklist_Item
exports.create = (req, res) => {
  // Build object
  const new_item = {
    student_id: req.body.student_id,
    checklist_item_id: req.body.checklist_item_id,
    state: req.body.state || "Pending",
  };

  Student_Checklist_Item.create(new_item)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Error creating record" })
    );
};

// Retrieve all Student_Checklist_Items (optionally filtered by student_id)
exports.findAll = (req, res) => {
  const student_id = req.query.student_id;
  const condition = student_id
    ? { student_id: { [Op.eq]: student_id } }
    : null;

  Student_Checklist_Item.findAll({ where: condition })
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Error retrieving records" })
    );
};

// Retrieve a single Student_Checklist_Item by PK
exports.findOne = (req, res) => {
  const id = req.params.id;

  Student_Checklist_Item.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No record found with id=${id}.`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({ message: err.message || `Error retrieving id=${id}` })
    );
};

// Update a Student_Checklist_Item by id
exports.update = (req, res) => {
  const id = req.params.id;

  Student_Checklist_Item.update(req.body, { where: { id: id } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Record updated successfully." });
      } else {
        res.send({
          message: `Cannot update record with id=${id}. Maybe not found or no changes in body.`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({ message: err.message || `Error updating id=${id}` })
    );
};

// Delete a Student_Checklist_Item by id
exports.delete = (req, res) => {
  const id = req.params.id;

  Student_Checklist_Item.destroy({ where: { id: id } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Record deleted successfully!" });
      } else {
        res.send({
          message: `Cannot delete record with id=${id}. Maybe not found.`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({ message: err.message || `Error deleting id=${id}` })
    );
};

// Delete all Student_Checklist_Items
exports.deleteAll = (req, res) => {
  Student_Checklist_Item.destroy({ where: {}, truncate: false })
    .then((nums) =>
      res.send({ message: `${nums} record(s) deleted successfully!` })
    )
    .catch((err) =>
      res.status(500).send({ message: err.message || "Error deleting records" })
    );
};
