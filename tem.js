const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const catchAsync = require("./utils/catchAsync");
const User = require("./models/Users");
const bcrypt = require("bcrypt");
const Courses = require("./models/Courses");
const Wishlist = require("./models/Wishlist");

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

mongoose
  .connect("mongodb://localhost:27017/loginDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo database connected");
  })
  .catch((err) => {
    console.log("Mongo connection error");
    console.log(err);
  });

var courses = [];
const username = "Devesh";
let wish = new Wishlist({ name: username, courses });
wish.save();
