// app/controllers/student_flight_plan_item.controller.js

const db       = require("../models");
const SFP      = db.student_flight_plan_item;  // our model :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}
const FPI      = db.flight_plan_item;          // for cloning items :contentReference[oaicite:4]{index=4}&#8203;:contentReference[oaicite:5]{index=5}
const Checklist= db.checklist_item;
const Op       = db.Sequelize.Op;

// 1) Generate a plan by copying every Flight_Plan_Item
exports.generate = async (req, res) => {
  const student_id = req.body.student_id;
  if (!student_id) return res.status(400).send({ message: "Missing student_id" });

  const exist = await SFP.findAll({ where: { student_id } });
  if (exist.length) {
    return res.status(400).send({ message: "Plan already generated" });
  }

  const planItems = await FPI.findAll();
  const rows = planItems.map(pi => ({
    student_id,
    checklist_item_id: pi.checklist_item_id,
    semester_number:   pi.semester_number,
    state:             "Pending",
  }));

  const created = await SFP.bulkCreate(rows);
  return res.status(201).send(created);
};

// 2) Fetch (with optional filters & joins)
exports.findAll = async (req, res) => {
  const { student_id, state, pendingApproval, includeChecklist, includeStudent } = req.query;
  const where = {};
  if (student_id)    where.student_id    = student_id;
  if (state)         where.state         = state;
  if (pendingApproval === "true") {
    where.state          = "Completed";
    where.admin_approval = null;
  }

  const include = [];
  if (includeChecklist === "true") include.push({ model: Checklist });
  if (includeStudent    === "true") include.push({ model: db.student, as: "student" });

  const items = await SFP.findAll({ where, include });
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
