module.exports = (sequelize, Sequelize) => {
    const Flight_Plan_Item = sequelize.define("flight_plan_item", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        checklist_item_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        semester_number: {
            type: Sequelize.INTEGER
        }
    },{
        timestamps: false,
      });
    return Flight_Plan_Item;
};