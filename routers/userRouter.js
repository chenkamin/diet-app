const express = require("express");
const router = express.Router();
const userController = require("./../controllers/usersController");
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

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.get("/", authController.protect, userController.getAllUsers);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword/",
  authController.protect,
  authController.updatePassword
);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser);
// .delete(userController.deleteUser);

module.exports = router;
