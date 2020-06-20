// const Sequelize = require("sequelize");
// const User = require("./User");
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

// const Food = sequelize.define(
//   "foods",
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
//     points: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//     },
//     createdAt: {
//       field: "created_at",
//       type: Sequelize.DATE,
//     },
//     updatedAt: {
//       field: "updated_at",
//       type: Sequelize.DATE,
//     },
//   },
//   {
//     // options
//   }
// );

// module.exports = Food;
