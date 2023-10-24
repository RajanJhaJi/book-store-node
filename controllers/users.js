require("dotenv").config();
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registering new User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    if (!(username && email && password)) {
      return res.status(400).json({ message: "all fields are required!" });
    }

    const userData = {
      username,
      email,
      password: encryptedPassword,
    };

    // create user if not exist
    const user = await UserModel.create(userData);

    if (!user) {
      res.status(400).send("Couldn't Create User!");
    }
    // create a jsonwebtoken
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWTSECRETKEY, // secret key
      {
        expiresIn: "1h",
      }
    );

    // save token in database
    user.token = token;
    await user.save();

    const options = {
      expire: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // cookie will expire in 2 days
      httpOnly: true,
    };

    res.cookie("token", token, options);

    return res.status(201).json({
      success: true,
      message: "User created Successfully!",
      userId: user.id,
      token: user.token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something Went Wrong: " + err });
  }
};

// Login new User
exports.loginUser = async (req, res, next) => {
  try {
    // get request body
    const { email, password } = req.body;

    // find user in db
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    // verify the credentials
    if (!(user && (await bcrypt.compare(password, user.password)))) {
      return res.status(400).json({ message: "credentials are incorrect!" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWTSECRETKEY, {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    // set cookie
    const cookieOptions = {
      expire: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, cookieOptions);

    // send token to user
    return res.status(200).json({
      message: "Loged In Successfully!",
      userId: user.id,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ error: "something went wrong: " + err });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    // get the user
    const userId = req.user;

    // find the user
    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
    });

    // clear the token cookie
    res.clearCookie("token");

    // clear user token
    user.token = null;
    await user.save();
    return res
      .status(200)
      .json({ message: "logged out successfully!", userId });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong: " + err });
  }
};
