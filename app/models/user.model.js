// models/user.model.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Role: 0 = student (default), 1 = admin, 2 = staff
      role: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: "0=student,1=admin,2=staff",
      },
      // refresh_token: {
      //   type: DataTypes.STRING(512),
      //   allowNull: true,
      // },
      // expiration_date: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  return User;
};
