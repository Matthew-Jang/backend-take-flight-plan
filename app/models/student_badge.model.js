module.exports = (sequelize, DataTypes) => {
    const StudentBadge = sequelize.define("student_badge", {
      id:        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      student_id:{ type: DataTypes.INTEGER, allowNull: false },
      badge_id:  { type: DataTypes.INTEGER, allowNull: false },
      awarded_at:{ type: DataTypes.DATE,    defaultValue: DataTypes.NOW }
    }, {
      tableName:       "student_badges",
      timestamps:      false,
      indexes: [{ unique: true, fields: ["student_id","badge_id"] }]
    });
    return StudentBadge;
  };
  