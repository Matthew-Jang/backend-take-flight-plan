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
            type: Sequelize.String
        },
        description: {
            type: Sequelize.TEXT
        }, 
        points: {
            type: Sequelize.INTEGER
        },
        semesters_til_graduation: {
            type: Sequelize.INTEGER
        }
    });
    return Checklist_Item;
};