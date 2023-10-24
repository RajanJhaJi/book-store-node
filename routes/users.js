const express = require("express");
const { saveUser, authorizeUser } = require("../Middleware/authUser");

const router = express.Router();

const { loginUser, registerUser, logoutUser } = require("../controllers/users");

router.post("/login", loginUser);
router.post("/register", saveUser, registerUser);
router.post("/logout", authorizeUser, logoutUser);

module.exports = router;
