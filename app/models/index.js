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

// Import Models
db.user = require("./user.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);
db.reward = require("./reward.model.js")(sequelize, Sequelize);
db.studentReward = require("./student_rewards.model.js")(sequelize, Sequelize);

// User Relationships
db.user.hasMany(db.session, { as: "sessions", foreignKey: { allowNull: false }, onDelete: "CASCADE" });
db.session.belongsTo(db.user, { as: "user", foreignKey: { allowNull: false }, onDelete: "CASCADE" });

// Reward Relationships
db.user.hasMany(db.studentReward, { as: "rewards", foreignKey: "student_id" });
db.reward.hasMany(db.studentReward, { as: "redemptions", foreignKey: "reward_id" });

module.exports = db;
