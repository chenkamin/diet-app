const express = require("express");
const router = express.Router();
const groupController = require("./../controllers/groupController");
const authController = require("./../controllers/authController");
const Sequelize = require("sequelize");
const sequelize = new Sequelize("diet", "root", "ohad152", {
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

router.get("/", authController.protect, groupController.getAllGroups);



module.exports = router;
