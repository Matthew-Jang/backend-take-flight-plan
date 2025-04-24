const db      = require("../models");
const User    = db.user;
const Student = db.student;
const Op      = db.Sequelize.Op;

function flattenUser(u) {
  const base = {
    id:    u.id,
    fName: u.fName,
    lName: u.lName,
    email: u.email,
  };

  // If the join came back, use its values; otherwise default to zero
  if (u.student) {
    base.points_awarded = u.student.points_awarded;
    base.points_used    = u.student.points_used;
  } else {
    base.points_awarded = 0;
    base.points_used    = 0;
  }

  return base;
}

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.fName) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a User
  const user = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    // refresh_token: req.body.refresh_token,
    // expiration_date: req.body.expiration_date
  };

  // Save User in the database
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve all People from the database.
exports.findAll = async (req, res) => {
  const id = req.query.id;
  const condition = id ? { id: { [Op.like]: `%${id}%` } } : null;

  try {
    const users = await User.findAll({
      where: condition,
      attributes: ["id","fName","lName","email"],
      include: [{
        model: Student,
        attributes: ["points_awarded","points_used"]
      }]
    });

    // Flatten and send
    res.json(users.map(flattenUser));
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Find a single User with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id, {
      attributes: ["id","fName","lName","email"],
      include: [{ model: Student, attributes: ["points_awarded","points_used"] }]
    });
    if (!user) {
      return res.status(404).send({ message: `User ${id} not found` });
    }
    res.json(flattenUser(user));
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Find a single User with an email
exports.findByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["id","fName","lName","email"],
      include: [{ model: Student, attributes: ["points_awarded","points_used"] }]
    });
    if (!user) {
      return res.status(404).send({ message: `User ${email} not found` });
    }
    res.json(flattenUser(user));
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all People from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} People were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people.",
      });
    });
};

// Modify users Points
exports.modifyPoints = async (req, res) => {
  const { amount, action } = req.body;
  const userId = req.params.id;

  if (typeof amount !== "number" || !["add", "subtract"].includes(action)) {
    return res.status(400).send({
      message: "Invalid request. Must include 'amount' (number) and 'action' (add/subtract).",
    });
  }

  try {
    const student = await Student.findOne({ where: { user_id: userId } });

    if (!student) {
      return res.status(404).send({ message: `Student not found for user_id=${userId}` });
    }

    if (action === "add") {
      student.points_awarded += amount;
    } else if (action === "subtract") {
      student.points_used += amount;
    }

    await student.save();

    res.send({
      message: `Points ${action}ed successfully.`,
      student: {
        id: student.id,
        user_id: student.user_id,
        points_awarded: student.points_awarded,
        points_used: student.points_used,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "Error modifying student points.",
      error: error.message,
    });
  }
};