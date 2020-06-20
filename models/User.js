// const Sequelize = require("sequelize");
// const Food = require("./Food");

// const sequelize = new Sequelize("diet", "root", "ohad152", {
//   host: "localhost",
//   dialect: "mysql",
// });
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });

// const User = sequelize.define(
//   "users",
//   {
//     // attributes

//     id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true,
//     },
//     name: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     password: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     passwordConfirm: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     passwordChangedAt: {
//       type: Sequelize.DATE,
//     },
//     passWordResetToken: {
//       type: Sequelize.DATE,
//     },
//     role: {
//       type: Sequelize.STRING,
//     },
//     passwordResetExpires: {
//       type: Sequelize.DATE,
//     },
//     createdAt: {
//       field: "created_at",
//       type: Sequelize.DATE,
//     },
//     updatedAt: {
//       field: "updated_at",
//       type: Sequelize.DATE,
//     },
//     active: Sequelize.BOOLEAN,
//     initialWeight: Sequelize.INTEGER,
//     height: Sequelize.INTEGER,
//   },
//   {
//     // options
//   }
// );
// // User.belongsToMany(Food, { through: "user_id" });

// module.exports = User;
