const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const Mail = require("nodemailer/lib/mailer");
// console.log(app.get('env'));
// console.log(process.env);

const Sequelize = require("sequelize");
// Option 1: Passing parameters separately
let sequelize = new Sequelize("diet", "root", "ohad152", {
  host: "localhost",
  dialect: "mysql",
});

const database = {
  sequelize,
};
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`app listen on ${port}`);
});

module.exports = database;
