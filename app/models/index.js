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
db.cliftonStrength = require("./clifton_strengths.model.js")(sequelize, Sequelize);

// Tasks, Experiences, Points, Rewards
db.checklist_Item = require("./checklist_item.model")(sequelize, Sequelize);
db.event = require("./event.model.js")(sequelize, Sequelize); 
db.reward = require("./reward.model.js")(sequelize, Sequelize);
db.studentReward = require("./student_rewards.model.js")(sequelize, Sequelize);

/*** Relationships ***/
// User - Session
db.user.hasMany(db.session, { as: "sessions", foreignKey: { allowNull: false }, onDelete: "CASCADE" });
db.session.belongsTo(db.user, { as: "user", foreignKey: { allowNull: false }, onDelete: "CASCADE" });

// User <-> Student
db.user.hasOne(db.student, { foreignKey: "user_id" });
db.student.belongsTo(db.user, { foreignKey: "user_id" });

// Student <-> Major
db.major.hasMany(db.student, { foreignKey: "major_id" });
db.student.belongsTo(db.major, { foreignKey: "major_id" });

// Student <-> Badge
db.Student.belongsToMany(db.Badge, {
  through: "student_badges",
  foreignKey: "student_id",
  otherKey: "badge_id",
});
db.Badge.belongsToMany(db.Student, {
  through: "student_badges",
  foreignKey: "badge_id",
  otherKey: "student_id",
});

// Student <-> Clifton_Strength
db.Student.belongsToMany(db.CliftonStrength, {
  through: "student_clifton_strengths",
  foreignKey: "student_id",
  otherKey: "clifton_strengths_id",
});
db.CliftonStrength.belongsToMany(db.Student, {
  through: "student_clifton_strengths",
  foreignKey: "clifton_strengths_id",
  otherKey: "student_id",
});

// Student <-> Reward
db.student.belongsToMany(db.reward, {
  through: db.studentReward,
  foreignKey: "student_id",
  otherKey: "reward_id",
});
db.reward.belongsToMany(db.student, {
  through: db.studentReward,
  foreignKey: "reward_id",
  otherKey: "student_id",
});

// Student <-> Event
db.Student.belongsToMany(db.Event, {
  through: "student_events",
  foreignKey: "student_id",
  otherKey: "event_id",
});
db.Event.belongsToMany(db.Student, {
  through: "student_events",
  foreignKey: "event_id",
  otherKey: "student_id",
});

// Student <-> Checklist_Item
db.Student.belongsToMany(db.Checklist_Item, {
  through: "student_checklist_items",
  foreignKey: "student_id",
  otherKey: "checklist_item_id",
});
db.Checklist_Item.belongsToMany(db.Student, {
  through: "student_checklist_items",
  foreignKey: "checklist_item_id",
  otherKey: "student_id",
});

// Checklist_Item <-> Event
db.Checklist_Item.belongsToMany(db.Event, {
  through: "checklist_item_events",
  foreignKey: "checklist_item_id",
  otherKey: "event_id",
});
db.Event.belongsToMany(db.Checklist_Item, {
  through: "checklist_item_events",
  foreignKey: "event_id",
  otherKey: "checklist_item_id",
});

// Reward Relationships
db.user.hasMany(db.studentReward, { as: "rewards", foreignKey: "student_id" });
db.reward.hasMany(db.studentReward, { as: "redemptions", foreignKey: "reward_id" });

module.exports = db;
