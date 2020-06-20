const express = require("express");
const foodRouter = require("./routers/foodRouter");
const userRouter = require("./routers/userRouter");
const mealRouter = require("./routers/mealRouter");

const app = express();
const Sequelize = require("sequelize");
const User = require("./models/User");

// //middleWare
// // console.log(process.env.NODE_ENV)
// //set security http headers
// app.use(helmet());

// //dev logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
// //limit requests from same ip
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many request from this IP , please try again in an hour',
// });
// app.use('/api', limiter);
// //parser
app.use(express.json({ limit: "10kb" }));

// //data sanitization against noAQL query injection
// app.use(mongoSanitize());
// //data sanitization against xss
// app.use(xss());
// //prevant params polution
// app.use(
//   hpp({
//     shiteList: [
//       'duration',
//       'ratingsQuantiy',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price',
//     ],
//   })
// );
// //serving static file
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("HELLO MIDDLE");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// //routes
app.use("/foods", foodRouter);
app.use("/users", userRouter);
app.use("/meals", mealRouter);

// app.all('*', (req, res, next) => {
//   // const err = new Error(`cant find ${req.originalUrl} on the server`);
//   // err.status = 'fail';
//   // err.statusCode = 404;
//   next(new AppError(`cant find ${req.originalUrl} on the server`, 404));
// });

// app.use(globalErrorHandler);

module.exports = app;
