require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/book");
const db = require("./utils/database");

console.log(process.env.JWTSECRETKEY);

const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Users Routes
app.use("/api/users", userRoutes);

//Books Routes
app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 8080;

db.sync().then(() => {
  console.log("db has been synced!");
});

app.listen(PORT, (err) => {
  if (err) {
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}.`);
});
