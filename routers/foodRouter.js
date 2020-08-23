const express = require("express");
const router = express.Router();
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

router.get("/", async (req, res, next) => {
  console.log("FOODS");
  const foods = await sequelize.query("SELECT f.*,fg.name as groupName, fg.id as groupId FROM foods as f join foodGroups as fg on f.foodGroupId = fg.id", {
    type: Sequelize.QueryTypes.SELECT,
  });
  res.send(foods);
});
// router.route("/").get(foodConroller.getAllFoods).post(foodConroller.createFood);
// router
//   .route("/:id")
//   .get(foodConroller.getFood)
//   .patch(foodConroller.updateFood)
//   .delete(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide"),
//     foodConroller.deleteFood
//   );

module.exports = router;
