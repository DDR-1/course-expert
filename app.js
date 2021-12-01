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

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));

app.use("/public", express.static("public"));

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password, confirmpassword } = req.body;
  var mailformat = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  if (!email.match(mailformat)) {
    const error = "Email format not proper";
    const pagename = "Signup";
    const page = "register";
    req.flash("success", error);
    res.redirect("/register");
    return;
  }
  if (password.length < 6) {
    const error = "Sorry Password Length too short";
    const pagename = "Signup";
    const page = "register";
    req.flash("success", error);
    res.redirect("/register");
    return;
  }
  if (password != confirmpassword) {
    const error = "Sorry Passwords do not match";
    const pagename = "Signup";
    const page = "register";
    req.flash("success", error);
    res.redirect("/register");
    // res.render("error", { error, pagename, page });
    return;
  }
  const courses = [];
  const user = new User({ username, password, email });
  const wish = new Wishlist({ name: username, courses });
  await user.save();
  await wish.save();
  const msg = "Successfully registered";
  req.flash("success", msg);
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username, password);
  if (foundUser) {
    req.session.username = username;
    req.flash("success", "Login Successful. Welcome!");
    res.redirect("/index");
  } else {
    const error = "Uh Oh! Incorrect Username or Password";
    const pagename = "Login";
    const page = "login";
    req.flash("error", error);
    res.redirect("/login");
  }
});

app.get(
  "/index",
  catchAsync(async (req, res) => {
    username = req.session.username;
    req.flash("success");
    let query = {};
    if (req.session.filterbool) {
      query = req.session.query;
      req.session.filterbool = false;
    }
    if (req.session.searchbool) {
      let search = req.session.search;
      query = { name: { $regex: search, $options: "i" } };
      req.session.searchbool = false;
    }
    const courses = await Courses.find(query);
    req.session.query = {};
    req.session.search = {};
    res.render("index", { courses, username });
  })
);

app.post("/filter", async (req, res) => {
  req.session.query = req.body;
  req.session.filterbool = true;
  res.redirect("/index");
});

app.post("/search", async (req, res) => {
  req.session.search = req.body.search;
  req.session.searchbool = true;
  res.redirect("/index");
});

app.get("/wishlist", async (req, res) => {
  username = req.session.username;

  const user = await Wishlist.findOne({ name: username });
  const courses = await Courses.find({ _id: user.courses });
  res.render("wishlist", { courses, username });
});

app.post(
  "/wishlistadd",
  catchAsync(async (req, res) => {
    let coursename = req.body.coursename;
    let username = req.session.username;

    let user = await Wishlist.findOne({ name: username });
    let course = await Courses.findOne({
      name: coursename,
    });
    await Wishlist.updateOne(
      { name: username },
      { $push: { courses: course } }
    );
    res.redirect(`/index`);
  })
);

app.post(
  "/wishlistrm",
  catchAsync(async (req, res) => {
    let coursename = req.body.coursename;
    let username = req.session.username;
    let course = await Courses.findOne({
      name: coursename,
    });
    await Wishlist.updateOne(
      { name: username },
      { $pull: { courses: course._id } }
    );
    res.redirect(`/index`);
  })
);

app.get("/blog", (req, res) => {
  username = req.session.username;
  res.render("blog", { username });
});

app.get("/support", (req, res) => {
  username = req.session.username;
  res.render("support", { username });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("Serving on Port 3000");
});
