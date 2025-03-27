module.exports = (sequelize, DataTypes) => {
    const Reward = sequelize.define("reward", {
      reward_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },{
      timestamps: false,
    });
  
    return Reward;
  };
  