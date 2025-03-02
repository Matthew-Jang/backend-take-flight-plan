module.exports = (sequelize, Sequelize) => {
    const Badge = sequelize.define("badge", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },    
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      points: { type: Sequelize.INTEGER },
      exp: { type: Sequelize.INTEGER },
      // refresh_token: {
      //   type: Sequelize.STRING(512),
      //   allowNull: true
      // },
      // expiration_date: {
      //   type: Sequelize.DATE,
      //   allowNull: true
      // },
    });
  
    return Badge;
  };




// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('mysql://user:password@localhost:3306/dbname'); // MySQL connection

// const Task = sequelize.define('Task', {
//     title: { type: DataTypes.STRING, allowNull: false },
//     description: { type: DataTypes.STRING },
//     points: { type: DataTypes.INTEGER },
//     isComplete: { type: DataTypes.BOOLEAN, defaultValue: false },
//     createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// });

// const Experience = sequelize.define('Experience', {
//     title: { type: DataTypes.STRING, allowNull: false },
//     description: { type: DataTypes.STRING },
//     points: { type: DataTypes.INTEGER },
//     date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// });

// const Badge = sequelize.define('Badge', {
//     name: { type: DataTypes.STRING, allowNull: false },
//     description: { type: DataTypes.STRING },
//     criteria: { type: DataTypes.STRING },
//     earned: { type: DataTypes.BOOLEAN, defaultValue: false },
//     createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// });

// module.exports = { Task, Experience, Badge };
