const express = require("express");
const { authorizeUser } = require("../Middleware/authUser");

const router = express.Router();

const { getBooks, addBook } = require("../controllers/books");

router.get("/", getBooks);
router.post("/add", authorizeUser, addBook);

module.exports = router;
