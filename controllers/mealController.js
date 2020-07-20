const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Sequelize = require("sequelize");
const moment = require("moment");

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

exports.createMeal = async (req, res) => {
  console.log("meal");
  const now = moment().format("YYYY-MM-DD");
  const { userId, foodId } = req.body;
  let user = await sequelize.query(
    `insert INTO foods_users VALUES (${null},${userId}, ${foodId}, '${now}')`,
    { type: Sequelize.QueryTypes.INSERT }
  );

  const points = await sequelize.query(
    `SELECT sum(points) as  totalPoints FROM diet.foods_users as A
          join foods as B on A.food_id = B.id
          where A.user_id = ${userId} and date = '${now}'`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  const meals = await sequelize.query(
    `SELECT * FROM diet.foods_users as A
          join foods as B on A.food_id = B.id
          where A.user_id = ${userId} and date = '${now}'`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  res.send({ meals, points });
};

exports.meal = async (req, res) => {
  const { id, date } = req.params;
  console.log("meal");
  const points = await sequelize.query(
    `SELECT sum(points) as  totalPoints FROM diet.foods_users as A
          join foods as B on A.food_id = B.id
          where A.user_id = ${id} and date = '${date}'`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  const meals = await sequelize.query(
    `SELECT * FROM diet.foods_users as A
          join foods as B on A.food_id = B.id
          where A.user_id = ${id} and date = '${date}'`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  res.send({ meals, points });
};
