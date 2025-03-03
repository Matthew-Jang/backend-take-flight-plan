module.exports = (sequelize, DataTypes) => {
    const Clifton_Strength = sequelize.define("clifton_strength", {
      clifton_strengths_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return Clifton_Strength;
  };
  