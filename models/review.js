const mongoose = require("mongoose");
const Cafe = require("./cafe");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: [true, "rating is Required!"],
  },
  body: {
    type: String,
    required: [true, "Body is Required !"],
  },
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
