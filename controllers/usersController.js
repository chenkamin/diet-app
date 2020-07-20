const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
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

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let query;
  if (Object.entries(req.query).length !== 0) {
    console.log("INIF1");
    query = `SELECT * FROM diet.users_groups as U
    left join users as U1 on U.user_id = U1.id
    where U.group_id = ${req.query.groupId}`;
  } else {
    console.log("INIF2");
    query = "SELECT * FROM users";
  }
  const users = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });
  res.status(200).json({
    results: users.length,
    status: "success",
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet define",
  });
};
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await sequelize.query(
    `SELECT * from users where id = ${req.params.id}`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  res.status(500).json({
    status: "error",
    user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "this route is not for pasword update , please use / updateMyPassword",
        400
      )
    );
  }
  //filterd
  const filteredBody = filterObj(req.body, "name", "email");
  //update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "sucess",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const deleteddUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: "sucess",
    data: {
      user: deleteddUser,
    },
  });
});

exports.updateUser = async (req, res) => {
  console.log(req.params.id);
  //   await Sequelize.query(`insert foods_users VALUES (${null},)`)
  res.status(500).json({
    status: "error",
    message: "this route is not yet define",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet define",
  });
};
