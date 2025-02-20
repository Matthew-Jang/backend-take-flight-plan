const db = require("../models");
const Major = db.major;
const Op = db.Sequelize.Op;

// Create and Save a new Major
exports.create = (req, res) => {
  // Validate request: ensure that 'name' is provided.
  if (!req.body.name) {
    res.status(400).send({
      message: "Content cannot be empty! 'name' is required.",
    });
    return;
  }

  // Create a Major object from the request body.
  const major = {
    id: req.body.id,
    name: req.body.name,
    department: req.body.department,
  };

  // Save Major in the database.
  Major.create(major)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Major.",
      });
    });
};

// Retrieve all Majors from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { [Op.like]: `%${id}%` } } : null;

  Major.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving majors.",
      });
    });
};

// Find a single Major with an id.
exports.findOne = (req, res) => {
  const id = req.params.id;

  Major.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Major with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Major with id=" + id,
      });
    });
};

// Update a Major by the id in the request.
exports.update = (req, res) => {
  const id = req.params.id;

  Major.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Major was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Major with id=${id}. Maybe Major was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Major with id=" + id,
      });
    });
};

// Delete a Major with the specified id in the request.
exports.delete = (req, res) => {
  const id = req.params.id;

  Major.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Major was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Major with id=${id}. Maybe Major was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Major with id=" + id,
      });
    });
};

// Delete all Majors from the database.
exports.deleteAll = (req, res) => {
  Major.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Majors were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all majors.",
      });
    });
};
