const express = require("express");
const router = express.Router();
const {
  showCafes,
  getAddCafePage,
  addCafe,
  getCafeById,
  getEditPage,
  editCafe,
  deleteCafe,
} = require("../controllers/cafes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const User = require("../models/user");
const asyncErrorHandler = require("../utils/errorHandler").asyncErrorHandler;
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
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
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(session(sessionConfig));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const { validateCafe } = require("../middleware");
router.use(session(sessionConfig));
const flash = require("connect-flash");
router.use(flash());
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
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
    format: async (req, file) => "png", // supports promises as well
    public_id: (req, file) => `${file.filename}_cafe_image`,
  },
});
// const parser = multer({ storage: storage });
const upload = multer({ storage });

router.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// router.engine('html', require('ejs').renderFile);
// router.use(cookieParser("secretkey"));

router.get("/", asyncErrorHandler(showCafes));

router
  .route("/add")
  .get(getAddCafePage)
  .post(upload.single("image"), validateCafe, asyncErrorHandler(addCafe));

router.get("/:id", asyncErrorHandler(getCafeById));

router
  .route("/:id/edit")
  .get(asyncErrorHandler(getEditPage))
  .patch(asyncErrorHandler(editCafe));

router.delete("/:id/delete", asyncErrorHandler(deleteCafe));

module.exports = router;
