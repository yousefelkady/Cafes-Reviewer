const mongoose = require("mongoose");
const city = require("cities.json");
const Schema = mongoose.Schema;
const Review = require("./review");


const cafeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is Required!"],
  },
  description: String,
  price: {
    type: Number,
    required: [true, "Price field is Required!"],
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

cafeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const deleted = await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Cafe = new mongoose.model("Cafe", cafeSchema);

module.exports = Cafe;
