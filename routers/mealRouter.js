const express = require("express");
const router = express.Router();
const getItem = require("./../utils/getItem");
const mealController = require("./../controllers/mealController");
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

router.post("/", authController.protect, mealController.createMeal);

router.get("/", authController.protect, mealController.meal);

// router.get("/mealsPerDay", async (req, res) => {

module.exports = router;
