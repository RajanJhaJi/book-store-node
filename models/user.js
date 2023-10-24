const { DataTypes } = require("sequelize");

const db = require("../utils/database");

const User = db.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

// Create the table if it doesn't exist and does nothing if it exists.
User.sync().then(() => {
  console.log("User Model synced with db.");
});

module.exports = User;
