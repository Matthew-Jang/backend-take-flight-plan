// controllers/user.controller.js

const db      = require("../models");
const User    = db.user;
const Student = db.student;
const Op      = db.Sequelize.Op;

/**
 * Helper to flatten the Sequelize User + Student join
 */
function flattenUser(u) {
  const base = {
    id:    u.id,
    fName: u.fName,
    lName: u.lName,
    email: u.email,
    role:  u.role,               // ← include the role field
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
  if (!req.body.fName) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  const user = {
    id:    req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    // role is assigned elsewhere (e.g. default in model or via admin)
  };

  User.create(user)
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users
exports.findAll = async (req, res) => {
  const id = req.query.id;
  const condition = id ? { id: { [Op.like]: `%${id}%` } } : null;

  try {
    const users = await User.findAll({
      where: condition,
      attributes: ["id","fName","lName","email","role"],
      include: [{
        model: Student,
        attributes: ["points_awarded","points_used"]
      }]
    });
    res.json(users.map(flattenUser));
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Find a single User by id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id, {
      attributes: ["id","fName","lName","email","role"],
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

// Find a single User by email
exports.findByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["id","fName","lName","email","role"],
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

// Update a User by id
exports.update = (req, res) => {
  const id = req.params.id;
  User.update(req.body, { where: { id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "User was updated successfully." });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating User with id=" + id });
    });
};

// Delete a User by id
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({ where: { id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "User was deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete User with id=${id}. Maybe not found!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Could not delete User with id=" + id });
    });
};

// Delete all Users
exports.deleteAll = (req, res) => {
  User.destroy({ where: {}, truncate: false })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users."
      });
    });
};

// Modify a Student's points
exports.modifyPoints = async (req, res) => {
  const { amount, action } = req.body;
  const userId = req.params.id;

  if (typeof amount !== "number" || !["add", "subtract"].includes(action)) {
    return res.status(400).send({
      message: "Invalid request. Must include 'amount' (number) and 'action' (add/subtract)."
    });
  }

  try {
    const student = await Student.findOne({ where: { user_id: userId } });
    if (!student) {
      return res.status(404).send({ message: `Student not found for user_id=${userId}` });
    }

    if (action === "add") {
      student.points_awarded += amount;
    } else {
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

// ----------------------------------------------
// Return the current authenticated user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const u = await User.findByPk(req.userId, {
      attributes: ["id", "fName", "lName", "email", "role"],
      include: [{
        model: Student,
        attributes: ["points_awarded", "points_used"]
      }]
    });
    if (!u) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(flattenUser(u));
  } catch (err) {
    next(err);
  }
};
