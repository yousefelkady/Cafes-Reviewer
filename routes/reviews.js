const express = require("express");
const router = express.Router({mergeParams : true});
const cookieParser = require("cookie-parser");
const session = require("express-session");
// router.use(cookieParser("secretkey"));
const { reviewSchema } = require("../schemas");
const AppError = require("../utils/appError").AppError;
const Cafe = require("../models/cafe");
const Review = require("../models/review");
const asyncErrorHandler = require("../utils/errorHandler").asyncErrorHandler;
const methodOverride = require("method-override");
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

// router.use((req, res, next) => {
//   res.locals.success = res.flash("success");
//   res.locals.error = res.flash("error");
//   next();
// });



const validateReview = (req, res, next) => {
  console.log(req.body.rating);
  const { error, value } = reviewSchema.validate(req.body);
  console.log("Error:", error);
  console.log("value: ", value);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};


router.get("/", (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  res.render("review.ejs", { id });
});

router.post(
  "/",
  validateReview,
  asyncErrorHandler(async (req, res, next) => {
    const { rating, body } = req.body;
    const review = new Review({
      rating: rating,
      body: body,
    });
    const id = req.params.id;
    console.log(id);
    const result = await review.save();
    const cafe = await Cafe.findById(id);
    // console.log("this is the cafe:", cafe);
    cafe.reviews.push(review);
    const cafeSaved = await cafe.save();
    console.log("cafe Reveiws:", cafe.reviews);
    // res.json(cafe);
    // console.log(cafe);
    res.redirect(`/cafes/${id}`);
  })
);

router.delete(
  "/:reviewId/delete",
  asyncErrorHandler(async (req, res, next) => {
    const { id, reviewId } = req.params;
    console.log("Cafe ID:", id);
    console.log("Review ID:", reviewId);
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    const cafe = await Cafe.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    // res.json(cafe);
    console.log(cafe);
    res.redirect(`/cafes/${id}`);
  })
);




module.exports = router;