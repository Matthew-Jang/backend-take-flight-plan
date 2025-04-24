// app/models/event_signup.model.js
module.exports = (sequelize, DataTypes) => {
    const EventSignup = sequelize.define("event_signup", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      // timestamps: true by default => createdAt, updatedAt
    });
  
    return EventSignup;
  };
  