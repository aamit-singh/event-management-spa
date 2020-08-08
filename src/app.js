const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./authentication/passport-config");
const cors = require("cors");
const MongoStore = require("connect-mongo")(session);

const apiRouter = require("./routes/api");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// mongoose setup
const dbURI = require("../config").dbURI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then((data) => {
    console.log("connected to MongoDb");
  })
  .catch((err) => {
    console.log(err);
  });

// middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(
  session({
    secret: "event-api123",
    resave: false,
    saveUninitialized: false,
    secure: false,
    cookie: { maxAge: 3600000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 2 * 24 * 60 * 60,
    }),
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

// authentication setup
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api", apiRouter);
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
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
  res.status(err.status || 500).send("server error");
});

module.exports = app;
