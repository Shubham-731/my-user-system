const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const homeRoutes = require("./routes/index");
const userRoutes = require("./routes/user");
const { checkUser } = require("./middlewares/authMiddleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/users", express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("*", checkUser);
app.use("/", homeRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000...");
});
