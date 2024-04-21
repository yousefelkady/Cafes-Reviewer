const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const AppError = require("./utils/appError").AppError;
const cafesRouter = require("./routes/cafes");
const reviewsRouter = require("./routes/reviews");
const User = require("./models/user");
const authRouter = require("./routes/auth");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "mySessions",
  expires: 24 * 3600,
});
store.on("error", function (error) {
  console.log(error);
});
const sessionConfig = {
  store,
  secret: "yousefelkady",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.engine("ejs", ejsMate);
// app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/cafes", cafesRouter);
app.use("/cafes/:id/review", reviewsRouter);
app.use("/auth", authRouter);
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
require("dotenv").config();
const port = process.env.PORT;
const url = process.env.DB_URL;
const db = mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.log(error, "Happened");
  });

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cafes",
    format: async (req, file) => "jpeg", // supports promises as well
    public_id: (req, file) => "cafeImage",
  },
});
// const parser = multer({ storage: storage });
const upload = multer({ storage });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  console.log(app.locals.success);
  app.locals.error = req.flash("error");
  console.log(app.locals.error);
  next();
});

app.get("/", (req, res, next) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  const num = req.session.views;
  res.send("Hello");
});

app.get("/home", (req, res, next) => {
  res.render("home.html");
});

app.get("/upload", (req, res, next) => {
  res.render("upload.ejs");
});

app.post("/upload", upload.single("image"), async function (req, res) {
  console.log("req.body:", req.body);
  console.log(req.file["path"]);
  res.redirect("/upload");
});

app.all("*", (req, res, next) => {
  //res.render("error.ejs");
  next(new AppError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  //console.log(statusCode);
  res
    .status(statusCode)
    .render("error.ejs", { message: message, statusCode: statusCode });
});

app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
