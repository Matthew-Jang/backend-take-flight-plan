// -------- controllers/student_flight_plan_item.controller.js --------
const db        = require("../models");
const SFP       = db.student_flight_plan_item;
const FPI       = db.flight_plan_item;
const Checklist = db.checklist_item;
const Op = db.Sequelize.Op;

// 1) Generate a plan by copying every Flight_Plan_Item into the student table (denormalised snapshot)
exports.generate = async (req, res) => {
  const { student_id } = req.body;
  if (!student_id) return res.status(400).send({ message: "Missing student_id" });

  // prevent duplicates
  const exist = await SFP.count({ where: { student_id } });
  if (exist) return res.status(400).send({ message: "Plan already generated" });

  // pull each flight‑plan item with its checklist so we can copy details
  const planItems = await FPI.findAll({ include: [{ model: Checklist, as: "checklist" }] });

  const rows = planItems.map(pi => ({
    student_id,
    flight_plan_item_id: pi.id,
    checklist_item_id:   pi.checklist_item_id,

    // snapshot
    name:         pi.checklist.name,
    description:  pi.checklist.description,
    points:       pi.checklist.points,
    item_type:    pi.checklist.item_type,

    semester_number: pi.semester_number,
    state:           "Not Started"
  }));

  const created = await SFP.bulkCreate(rows, { returning: true });
  return res.status(201).send(created);
};

// 2) Fetch (with optional filters & joins)
exports.findAll = async (req, res) => {
  const { student_id, state, includeChecklist, includeStudent } = req.query;
  const where = {};
  if (student_id)    where.student_id    = student_id;
  if (state)         where.state         = state;

  const include = [];
  if (includeChecklist === "true") include.push({ model: Checklist, as: "checklist" });
  if (includeStudent   === "true") include.push({ model: db.student, as: "student" });

  const items = await SFP.findAll({ where, include, order: [["semester_number", "ASC"]] });
  return res.send(items);
};

// 3) Single record by PK
exports.findOne = (req, res) => {
  const id = req.params.id;
  SFP.findByPk(id)
    .then(data => data
      ? res.send(data)
      : res.status(404).send({ message: `Not found id=${id}` })
    )
    .catch(err => res.status(500).send({ message: err.message }));
};

// 4) Student “complete” action (with optional file upload)
exports.complete = async (req, res) => {
  const id = req.params.id;
  const update = { state: "Completed" };
  if (req.file) update.file_path = req.file.path;
  await SFP.update(update, { where: { id } });

 // 2) reload to get student_id & semester_number
 const item      = await SFP.findByPk(id);
 const studentId = item.student_id;
 const sem       = item.semester_number;

 // helper to award a badge without duplicating
 const award = async (badge_id) => {
   await db.student_badge.findOrCreate({
     where: { student_id: studentId, badge_id }
   });
 };

 // 3) count total completed tasks for this student
 const totalCompleted = await SFP.count({
   where: { student_id: studentId, state: "Completed" }
 });

 // 4) milestone badges by total completed
 if (totalCompleted === 1) await award(3); // First Flight
 if (totalCompleted === 3) await award(4); // Flight Crew

 // 5) Full Wingspan (single semester)
 const totalThisSem     = await SFP.count({ where: { student_id: studentId, semester_number: sem } });
 const completedThisSem = await SFP.count({
   where: {
     student_id:      studentId,
     semester_number: sem,
     state:           "Completed"
   }
 });
 if (completedThisSem === totalThisSem) {
   await award(5); // Full Wingspan
 }

 // 6) Full Wingspan tiers I–IV (paired semesters per year)
 // Map each semester to its year‐badge
 const yearBadgeMap = {
   1: 6, 2: 6,   // Semesters 1 & 2 → badge 6
   3: 7, 4: 7,   // Semesters 3 & 4 → badge 7
   5: 8, 6: 8,   // Semesters 5 & 6 → badge 8
   7: 9, 8: 9    // Semesters 7 & 8 → badge 9
 };
 const badgeId = yearBadgeMap[sem];
 if (badgeId) {
   // figure out the two semesters for this badge
   const semPairs = {
     6: [1,2],
     7: [3,4],
     8: [5,6],
     9: [7,8]
   }[badgeId];

   const totalYear     = await SFP.count({ where: { student_id: studentId, semester_number: { [Op.in]: semPairs } } });
   const completedYear = await SFP.count({
     where: {
       student_id:      studentId,
       semester_number: { [Op.in]: semPairs },
       state:           "Completed"
     }
   });
   if (completedYear === totalYear) {
     await award(badgeId);
   }
 }

  return res.send({ message: "Submitted for approval" });
};

// 5) Admin approve/deny or generic update
exports.update = (req, res) => {
  const id = req.params.id;
  SFP.update(req.body, { where: { id } })
    .then(num => num === 1
      ? res.send({ message: "Updated successfully" })
      : res.send({ message: `No change or not found id=${id}` })
    )
    .catch(err => res.status(500).send({ message: err.message }));
};

// 6) Delete one
exports.delete = (req, res) => {
  const id = req.params.id;
  SFP.destroy({ where: { id } })
    .then(num => num === 1
      ? res.send({ message: "Deleted successfully" })
      : res.send({ message: `Not found id=${id}` })
    )
    .catch(err => res.status(500).send({ message: err.message }));
};

// 7) Delete all 
exports.deleteAll = (req, res) => {
  SFP.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} record(s) deleted` }))
    .catch(err => res.status(500).send({ message: err.message }));
};
