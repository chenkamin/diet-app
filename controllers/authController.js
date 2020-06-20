const crypto = require("crypto");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcryptjs");

const AppError = require("./../utils/appError");
// const { networkInterfaces } = require('os');
// const email = require('./../utils/email');

const correctPassword = async (candidatePassword, userPassword) => {
  return await bcyrpt.compare(candidatePassword, userPassword);
};

// const changedPasswordAfter = async (user,JWTTimeStamp) {
//   if (passwordChangedAt) {
//     console.log(passwordChangedAt, JWTTimeStamp);
//     const changedTimestamp = parseInt(
//       passwordChangedAt.getTime() / 1000,
//       10
//     );
//     return JWTTimeStamp < changedTimestamp;
//   }
//   return false;
// }

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

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  //remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  if (req.body.password !== req.body.passwordConfirm) {
    res.send("SHIT");
    return;
  }
  const password = await bcyrpt.hash(req.body.password, 12);
  const newUserId = await sequelize.query(
    `INSERT INTO users (name , email,password) VALUES ('${name}','${email}','${password}')`
  );
  const newUser = await sequelize.query(
    `SELECT * from users where id = ${newUserId[0]}`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  console.log(newUser);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("PLEASE PROVIDE EMAIL AND PASSWORD", 400));
  }
  const user = await sequelize.query(
    `SELECT * from users where email = '${email}'`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  console.log(user);
  let isSame = await correctPassword(password, user[0].password);
  console.log(isSame);
  //   const user = await User.findOne({ email }).select("+password");

  if (!user || !(await correctPassword(password, user[0].password))) {
    return next(new AppError("INCORECT EMAIL/PASSWORD", 401));
  }

  createSendToken(user, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1 gett token and check if it is exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("you are not loged in", 401));
  }
  //2 verification Token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("decode :", decoded["id"][0]["id"]);

  // 3check if user exists
  const freshUser = await sequelize.query(
    `SELECT * FROM users where id = ${decoded["id"][0]["id"]}`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  if (!freshUser) {
    return next(new AppError("user not exists", 401));
  }
  //4check if change pass after jwt was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("user recently changed password", 401));
  }
  req.user = freshUser;
  next();
});

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.User.role)) {
//       return next(new AppError("you do not have premmisions to do it ", 403));
//     }
//     next();
//   };
// };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log("XXX");
  //get user base on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError("no user with this mail", 404));
  }
  //generate token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //send it in email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot you pass? submut a patch with your new passs and pass confir, to ${resetURL}. \nIf you didnt forget your pass , ignore the mail`;
  console.log(email);
  try {
    await email.sendEmail({
      email: user.email,
      subject: "Your password reset token , valid for 10",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passWordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError(
        "there was an error sending the email , try again later",
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passWordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //if token not expired and there is user , set new pass
  if (!user) {
    return next(new AppError("Token expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.password;
  user.passWordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //update passwordChangedAt

  //log the user in , send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user from collection

  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new AppError("cant find a user", 400));
  }
  //check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("password is not match the old password", 401));
  }
  //if so , update the pass

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //login send JWT
  createSendToken(user, 200, res);
});
