module.exports = (sequelize, DataTypes) => {
    const Student_Reward = sequelize.define("student_reward", {
      student_rewards_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reward_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending", // Can be "Pending", "Redeemed", or "Rejected"
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      timestamps: false
  });
  
    return Student_Reward;
  };
  