module.exports = (sequelize, Sequelize) => {
    const Student = sequelize.define("student", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      major_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      points_awarded: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      points_used: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    }, {
      timestamps: false
  });
    return Student;
  };
  