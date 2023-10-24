require("dotenv").config();
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");

// function to check if username and email already exists
exports.saveUser = async (req, res, next) => {
  try {
    const usernameExist = await UserModel.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (usernameExist) {
      return res.status(409).json({
        error: "username already taken!",
      });
    }

    const emailExist = await UserModel.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (emailExist) {
      return res.status(409).json({ error: "email already exists!" });
    }

    next();
  } catch (err) {
    console.log(err);
  }
};

// function to check if user authorised or not
exports.authorizeUser = async (req, res, next) => {
  try {
    // getting token from cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized User." });
    }

    // verify token
    const jwtObj = jwt.verify(token, process.env.JWTSECRETKEY);
    console.log("jwt decoded obj", jwtObj);
    req.user = jwtObj?.userId;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Something Went Wrong: " + err });
  }
};
