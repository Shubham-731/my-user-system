const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const User = require("../models/User");
const registerSchema = require("../schemas/register");
const loginSchema = require("../schemas/login");

const router = express();

const jwtSecret = process.env.JWT_SECRET;

// Generate JWT Tokens
function genToken(id) {
  return jwt.sign(id, jwtSecret);
}

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, confPassword, rememberMe } =
    req.body;

  try {
    // Validating the user inputs
    await registerSchema.validateAsync(
      {
        firstName,
        lastName,
        email,
        password,
        confPassword,
      },
      { abortEarly: false }
    );

    // Checking if the user is already registered
    const user = await User.findOne({ email });
    if (user) {
      res.status(409).json({ msg: "User already registered!" });
    } else {
      // Encrypting the password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Saving the user in the database
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      // Generating JWT token from user _id and saving in the cookies
      const userId = newUser._id.toString();
      const authToken = genToken(userId);

      rememberMe
        ? res.cookie("authToken", authToken, {
            maxAge: 10 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          })
        : res.cookie("authToken", authToken, {
            httpOnly: true,
          });

      // Sending the user as the response
      res.status(201).json(newUser);
    }
  } catch (err) {
    // Handle validation errors
    if (err.name === "ValidationError") {
      let errors = {
        fNameErr: "",
        lNameErr: "",
        passErr: "",
        emailErr: "",
        confPassErr: "",
      };

      err.details.forEach((element) => {
        errors[element.context.label] = element.message;
      });

      res.status(400).json(errors);
      return;
    }

    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    // Validating the inputs
    await loginSchema.validateAsync({ email, password }, { abortEarly: false });

    // Check if the user exist
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ msg: "User not found!" });
    } else {
      // Compare the password
      const verify = await bcrypt.compare(password, user.password);
      if (verify) {
        // Generate auth token
        const userId = user._id.toString();
        const authToken = genToken(userId);

        rememberMe
          ? res.cookie("authToken", authToken, {
              maxAge: 10 * 24 * 60 * 60 * 1000,
              httpOnly: true,
            })
          : res.cookie("authToken", authToken, {
              httpOnly: true,
            });

        // Sending the user as the response
        res.status(200).json(user);
      } else {
        res.status(403).json({ passErr: "Incorrect password" });
      }
    }
  } catch (err) {
    // Handle validation errors
    if (err.name === "ValidationError") {
      let errors = {
        emailErr: "",
        passErr: "",
      };

      err.details.forEach((element) => {
        errors[element.context.label] = element.message;
      });

      res.status(400).json(errors);
      return;
    }

    console.log(err);
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("authToken", "", { maxAge: 1 });
  res.redirect("/users/login");
});

module.exports = router;
