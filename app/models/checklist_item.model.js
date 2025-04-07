module.exports = (sequelize, Sequelize) => {
    const Checklist_Item = sequelize.define("checklist_item", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        item_type: {
            type: Sequelize.ENUM(
                "task",
                "experience"
            ),
        },
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        }, 
        points: {
            type: Sequelize.INTEGER
        },
    },{
        timestamps: false,
      });
    return Checklist_Item;
};