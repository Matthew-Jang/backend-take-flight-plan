// -------- models/index.js --------
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Initialize Sequelize with DB Config
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// Test Database Connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
});

// Initialize DB Object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

/*** Models ***/
// Auth 
db.user = require("./user.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);

// Core user things
db.student = require("./student.model")(sequelize, Sequelize);
db.badge = require("./badge.model")(sequelize, Sequelize);
db.major = require("./major.model")(sequelize, Sequelize);
db.clifton_strength = require("./clifton_strengths.model.js")(sequelize, Sequelize);

// Tasks, Experiences, Points, Rewards
db.checklist_item = require("./checklist_item.model")(sequelize, Sequelize);
db.flight_plan_item = require("./flight_plan_item.model")(sequelize, Sequelize);
db.student_flight_plan_item = require("./student_flight_plan_item.model.js")(sequelize, Sequelize);
db.event = require("./event.model.js")(sequelize, Sequelize); 
db.reward = require("./reward.model.js")(sequelize, Sequelize);
db.student_reward = require("./student_rewards.model.js")(sequelize, Sequelize);

/*** Relationships ***/
// User - Session
db.user.hasMany(db.session, { as: "sessions", foreignKey: { allowNull: false, onDelete: "CASCADE" } });
db.session.belongsTo(db.user, { as: "user", foreignKey: { allowNull: false, onDelete: "CASCADE" } });

// User <-> Student
db.user.hasOne(db.student, { 
  foreignKey: { name: "user_id", allowNull: false, onDelete: "CASCADE" } 
});
db.student.belongsTo(db.user, { 
  foreignKey: { name: "user_id", allowNull: false, onDelete: "CASCADE" } 
});

// Student <-> Major
db.major.hasMany(db.student, { foreignKey: "major_id" });
db.student.belongsTo(db.major, { foreignKey: "major_id" });

// Student <-> Badge
db.student.belongsToMany(db.badge, {
  through: "student_badges",
  foreignKey: { name: "student_id", onDelete: "CASCADE" },
  otherKey: { name: "badge_id", onDelete: "CASCADE" },
});
db.badge.belongsToMany(db.student, {
  through: "student_badges",
  foreignKey: { name: "badge_id", onDelete: "CASCADE" },
  otherKey: { name: "student_id", onDelete: "CASCADE" },
});

// Student <-> Clifton_Strength
db.student.belongsToMany(db.clifton_strength, {
  through: "student_clifton_strengths",
  foreignKey: { name: "student_id", onDelete: "CASCADE" },
  otherKey: { name: "clifton_strengths_id", onDelete: "CASCADE" },
});
db.clifton_strength.belongsToMany(db.student, {
  through: "student_clifton_strengths",
  foreignKey: { name: "clifton_strengths_id", onDelete: "CASCADE" },
  otherKey: { name: "student_id", onDelete: "CASCADE" },
});

// Student <-> Reward
db.student.belongsToMany(db.reward, {
  through: db.student_reward,
  foreignKey: { name: "student_id", onDelete: "CASCADE" },
  otherKey: { name: "reward_id", onDelete: "CASCADE" },
});
db.reward.belongsToMany(db.student, {
  through: db.student_reward,
  foreignKey: { name: "reward_id", onDelete: "CASCADE" },
  otherKey: { name: "student_id", onDelete: "CASCADE" },
});

// Student <-> Event
db.student.belongsToMany(db.event, {
  through: "student_events",
  foreignKey: { name: "student_id", onDelete: "CASCADE" },
  otherKey: { name: "event_id", onDelete: "CASCADE" },
});
db.event.belongsToMany(db.student, {
  through: "student_events",
  foreignKey: { name: "event_id", onDelete: "CASCADE" },
  otherKey: { name: "student_id", onDelete: "CASCADE" },
});

// checklist_item ↔ flight_plan_item (1:N)
db.checklist_item.hasMany(db.flight_plan_item, { foreignKey: { name: "checklist_item_id", allowNull: false, onDelete: "CASCADE" } });
db.flight_plan_item.belongsTo(db.checklist_item, { foreignKey: "checklist_item_id", as: "checklist" });

// checklist_item ↔ event (M:N)
db.checklist_item.belongsToMany(db.event, { through: "checklist_item_events", foreignKey: "checklist_item_id", otherKey: "event_id" });
db.event.belongsToMany(db.checklist_item, { through: "checklist_item_events", foreignKey: "event_id", otherKey: "checklist_item_id" });

// student ↔ student_flight_plan_item (1:N)
db.student.hasMany(db.student_flight_plan_item, { foreignKey: { name: "student_id", allowNull: false, onDelete: "CASCADE" }, as: "flightPlanItems" });
db.student_flight_plan_item.belongsTo(db.student, { foreignKey: "student_id", as: "student" });

// flight_plan_item ↔ student_flight_plan_item (1:N)
db.flight_plan_item.hasMany(db.student_flight_plan_item, { foreignKey: { name: "flight_plan_item_id", allowNull: false, onDelete: "CASCADE" }, as: "assignments" });
db.student_flight_plan_item.belongsTo(db.flight_plan_item, { foreignKey: "flight_plan_item_id", as: "flightPlanItem" });

// checklist_item ↔ student_flight_plan_item (1:N)  (optional but lets you still JOIN for refs)
db.checklist_item.hasMany(db.student_flight_plan_item, { foreignKey: { name: "checklist_item_id", onDelete: "CASCADE" } });
db.student_flight_plan_item.belongsTo(db.checklist_item, { foreignKey: "checklist_item_id", as: "checklist" });

module.exports = db;
