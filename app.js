var express = require("express");
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");

var indexRouter = require("./src/routes/index");
var appointmentsRouter = require("./src/routes/appointments");
var recieversRouter = require("./src/routes/recievers");

require("./src/services/scheduleScraper");
require("./src/services/scheduleDeleteOldAppointments");

const START_URL = "/server";

var app = express();
app.locals.env = app.settings.env;

// view engine setup
app.set("views", path.join(__dirname, "./public/views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(START_URL + "/public", express.static(path.join(__dirname, "../public/views")));
app.use(START_URL + "/", indexRouter);
app.use(START_URL + "/appointments", appointmentsRouter);
app.use(START_URL + "/recievers", recieversRouter);

const dbConnection = process.env.NODE_ENV === 'production' ?
  process.env.DB_CONNECTION_PROD :
  process.env.DB_CONNECTION_DEV;

// Connect to MongoDB
mongoose.connect(
  dbConnection,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log("Connected to MongoDB in a " + process.env.NODE_ENV + " mode.");
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error: ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connection disconnected.');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('MongoDB connection disconnected through app termination.');
    process.exit(0);
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
