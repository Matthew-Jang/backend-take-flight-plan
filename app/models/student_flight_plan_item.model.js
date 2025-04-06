module.exports = (sequelize, Sequelize) => {
  const Student_Flight_Plan_Item = sequelize.define(
    "student_flight_plan_item",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      checklist_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      semester_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      state: {
        type: Sequelize.ENUM("Pending", "Completed"),
        defaultValue: "Pending",
      },
      admin_approval: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "student_flight_plan_item", // hard‑coded table name
      freezeTableName: true, // model name will not be pluralized
      timestamps: false,
    }
  );
  return Student_Flight_Plan_Item;
};
