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

// const Foods_Users = sequelize.define("foods_users", {}, { timestamps: false });
// User.belongsToMany(Food, { through: "user_id" });
// Food.belongsToMany(User, { through: "food_id" });

// module.exports = Foods_Users;
