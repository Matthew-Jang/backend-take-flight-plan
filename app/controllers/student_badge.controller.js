// controllers/badge.controller.js
const db = require("../models");
const SB = db.student_badge;

// Award a badge
exports.award = async (req, res) => {
  try {
    const { student_id, badge_id } = req.body;
    const [award, created] = await SB.findOrCreate({
      where: { student_id, badge_id }
    });
    if (!created) return res.status(400).send({ message: "Already awarded" });
    res.status(201).send(award);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// List a student’s badges
exports.listForStudent = async (req, res) => {
  const student_id = req.query.student_id;
  const badges = await db.badge.findAll({
    include: { model: db.student, where: { id: student_id } }
  });
  res.send(badges);
};
