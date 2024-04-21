const { cafeSchema } = require("./schemas");
const AppError = require("./utils/appError").AppError;
const Joi = require('joi')

// module.exports.isLoggedIn = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     req.session.returnTo = req.originalUrl; // add this line
//     req.flash("error", "You must be signed in first!");
//     return res.redirect("/auth/login");
//   }
//   next();
// };

// module.exports.storeReturnTo = (req, res, next) => {
//   if (req.session.returnTo) {
//     res.locals.returnTo = req.session.returnTo;
//   }
//   next();
// };

//?Fixed the validation but for each field as its own not as a whole object similar to the tutorial
module.exports.validateCafe = (req, res, next) => {
  // console.log("request body:",req.body);
  const { error, value } = cafeSchema.validate(req.body);
  console.log("Error:", error);
  console.log("value: ", value);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    console.log("msg:", msg);
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
