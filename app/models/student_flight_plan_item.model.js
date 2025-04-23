// -------- models/student_flight_plan_item.model.js --------
module.exports = (sequelize, Sequelize) => {
  const StudentFlightPlanItem = sequelize.define("student_flight_plan_item", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

    student_id:         { type: Sequelize.INTEGER, allowNull: false },
    flight_plan_item_id:{ type: Sequelize.INTEGER, allowNull: false },
    checklist_item_id:  { type: Sequelize.INTEGER, allowNull: false },

    // denormalised snapshot fields
    name:        { type: Sequelize.STRING },
    description: { type: Sequelize.TEXT },
    points:      { type: Sequelize.INTEGER },
    item_type:   { type: Sequelize.STRING },

    semester_number: { type: Sequelize.INTEGER },
    state:           { type: Sequelize.ENUM("Not-Started", "Pending", "Completed"), defaultValue: "Not-Started" },
    admin_approval:  { type: Sequelize.INTEGER },
    file_path:       { type: Sequelize.STRING }
  }, {
    tableName: "student_flight_plan_item",
    freezeTableName: true,
    timestamps: false
  });
  return StudentFlightPlanItem;
};