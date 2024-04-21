const express = require("express");
const router = express.Router();
// const Joi = require("joi");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { cafeSchema } = require("../schemas");
const AppError = require("../utils/appError").AppError;
const User = require("../models/user");
const asyncErrorHandler = require("../utils/errorHandler").asyncErrorHandler;
const methodOverride = require("method-override");
const { storeReturnTo } = require("../middleware");
const sessionConfig = {
  secret: "yousefelkady",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
router.use(session(sessionConfig));
const flash = require("connect-flash");
router.use(flash());
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

router.get("/login", (req, res, next) => {
  res.render("login.ejs");
});

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureFlash: true,
//     failureRedirect: "/auth/login",
//   }),
//   (req, res, next) => {
//     req.flash("Hello");
//     res.redirect("/cafes");
//   }
// );

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back!");
    const redirectUrl = res.locals.returnTo || "/cafes";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/register", (req, res, next) => {
  console.log(res.locals.success);
  res.render("register.ejs");
});

router.post(
  "/register",
  asyncErrorHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    const user = new User({
      username: username,
      email: email,
    });
    const newUser = await User.register(user, password);
    if (newUser) {
      req.flash("success", "registered successfully");
      res.redirect("/cafes");
    }
    else{
      req.flash("error", "couldn't register");
      res.redirect("/cafes");
    }
    
  })
);

module.exports = router;
