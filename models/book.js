const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const Book = db.define(
  "book",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publication_year: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        min: {
          args: [1000],
          msg: "Publication year must be greater than 1000.",
        },
        max: {
          args: [2023],
          msg: "Publication year must be less than 2024.",
        },
      },
    },
    isbn: {
      type: DataTypes.STRING(13),
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

// create the table if doesn't exist and do nothing if exist
Book.sync().then(() => {
  console.log("Book is in synced with database.");
});

module.exports = Book;
