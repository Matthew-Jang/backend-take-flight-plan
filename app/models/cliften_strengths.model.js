module.exports = (sequelize, DataTypes) => {
    const CliftonStrength = sequelize.define("CliftonStrength", {
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
  
    return CliftonStrength;
  };
  