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
  console.log(req.body);
  const mealsBody = req.body;
  const now = moment().format("YYYY-MM-DD");
  for (m of mealsBody) {
    console.log(m)
    let user = await sequelize.query(
      `insert INTO foods_users VALUES (${null},${m.userId}, ${m.foodId},${m.groupId}, '${now}')`,
      { type: Sequelize.QueryTypes.INSERT }
    );
  }
  req.body[0].userId;
  console.log("======", req.body[0].userId)
  const points = await sequelize.query(
    `SELECT sum(points) as  totalPoints FROM diet.foods_users as A
          join foods as B on A.food_id = B.id
          where A.user_id = ${req.body[0].userId} and date = '${now}'`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  const meals = await sequelize.query(
    `SELECT * FROM diet.foods_users as A
          join foods as B on A.food_id = B.id
          where A.user_id = ${req.body[0].userId} and date = '${now}'`,
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
    `SELECT A.*,B.*,C.name as groupName, C.id as groupId FROM diet.foods_users as A
    join foods as B on A.food_id = B.id
    join foodGroups as C on B.foodGroupId = C.id
          where A.user_id = ${id} and  date_format(date, '%Y-%m-%d') = '${date}'`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  res.send({ meals, points });
};
