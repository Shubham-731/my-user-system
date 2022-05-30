const express = require("express");
const mongoose = require("mongoose");
const homeRoutes = require("./routes/index");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/test");

app.use("/", homeRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000...");
});
