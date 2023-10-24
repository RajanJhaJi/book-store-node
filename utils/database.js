require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    // port: process.env.PG_PORT,
    dialect: "postgres",
  }
);

// checking if database connected to the server
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database now connected to server! 🎉`);
  })
  .catch((err) => {
    console.log("couldn't connect to db ❌");
  });

module.exports = sequelize;
