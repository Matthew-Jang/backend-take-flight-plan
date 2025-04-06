module.exports = (sequelize, Sequelize) => {
    const Student_Checklist_Item = sequelize.define("student_checklist_item", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        checklist_item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        state: {
            type: Sequelize.ENUM("Pending", "Completed"),
            defaultValue: "Pending",
        },
        admin_approval: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
    },{
        tableName: "student_checklist_items",  // hard‑coded table name
        freezeTableName: true,                // model name will not be pluralized
        timestamps: false,
      });
    return Student_Checklist_Item;
};