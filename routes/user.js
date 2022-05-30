const express = require("express");
const registerSchema = require("../schemas/register");

const router = express();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, confPassword } = req.body;

  try {
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
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(401).json(err);
    }
  }
});

module.exports = router;
