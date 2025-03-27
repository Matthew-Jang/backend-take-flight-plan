module.exports = (sequelize, Sequelize) => {
    const Major = sequelize.define("major", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    }, {
      timestamps: false
  });
  
    return Major;
  };
  