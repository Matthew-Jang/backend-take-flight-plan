//badge controller


const db = require("../models");
const Badge = db.badge;
const Op = db.Sequelize.Op;

// Create and Save a new badge
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: "Content can not be empty!",
  //   });
  //   return;
  // }

  // Create a badge
  const badge = {

    id: req.body.id,
    title: req.body.title,
    type: req.body.type,
    description: req.body.description,
    // id: {
    //     type: Sequelize.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    //   },
    //   type: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //   },    
    //   title: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   },
    //   description: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   },
    //   points: { type: DataTypes.INTEGER },
    //   exp: { type: DataTypes.INTEGER },
    // refresh_token: req.body.refresh_token,
    // expiration_date: req.body.expiration_date
  };

  // Save badge in the database
  Badge.create(badge)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Badge.",
      });
    });
};

// Retrieve all Badges from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { [Op.like]: `%${id}%` } } : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving badges.",
      });
    });
};

// Find a single badge by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a badge by id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Badge.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Badge was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Badge with id=${id}. Maybe Badge was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Badge with id=" + id,
      });
    });
};

// Delete a badge by id
exports.delete = (req, res) => {
  const id = req.params.id;

  Badge.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Badge was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Badge with id=${id}. Maybe Badge was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all Badges from the database.
exports.deleteAll = (req, res) => {
  Badge.destroy({
    where: {},
    truncate: true,
  })
    .then((nums) => {
      res.send({ message: `${nums} Badges were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all badges.",
      });
    });
};


// const { Task, Experience, Badge } = require('./model');

// // Create a task
// const createTask = async (req, res) => {
//     const { title, description, points } = req.body;
//     try {
//         const newTask = await Task.create({ title, description, points });
//         res.status(201).json(newTask);
//     } catch (err) {
//         res.status(500).json({ message: 'Error creating task', error: err });
//     }
// };

// // Other controller actions remain similar (createExperience, completeTask, earnBadge)
