const express = require("express");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", { user: req.user });
});

module.exports = router;
