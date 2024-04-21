const Cafe = require("../models/cafe");
require("dotenv").config();
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
    public_id: (req, file) => `${req.file.filename}_cafe_image`,
  },
});
// const parser = multer({ storage: storage });
const upload = multer({ storage });



module.exports.showCafes = async (req, res, next) => {
  const cafes = await Cafe.find({});
  // console.log(cafes);
  //res.json(cafes);
  res.render("cafes.ejs", { cafes });
};

module.exports.getAddCafePage = (req, res) => {
  res.render("addCafe.ejs");
};

module.exports.addCafe = async (req, res, next) => {
  const { name, description, price, location, image } = req.body;
  console.log("req files:" , req.file);
  console.log("request body:",req.body);
  const cafe = new Cafe({
    name: name,
    description: description,
    price: price,
    location: location,
    image: req.file['path']
  });
  console.log("cafe:",cafe);
  cafe
    .save()
    .then((cafe) => {
      console.log(cafe);
      console.log(router.locals.addCafeSuccess);
      //res.json(cafe);
      req.flash("success");
      res.redirect(`/cafes/${cafe.id}`);
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Couldn't add Cafe");
      res.redirect("/cafes");
      //res.json(err);
    });
};

module.exports.getCafeById = async (req, res, next) => {
  const { id } = req.params;
  const cafe = await Cafe.findById(id).populate("reviews").exec();
  if (cafe) {
    const reviews = cafe.reviews;
    res.render("cafePage.ejs", { cafe, reviews });
  } else {
    req.flash("error", "Couldn't find Cafe");
    res.redirect("/cafes");
  }
  //console.log(reviews);
  // res.json(cafe);
  // console.log(cafe);
};

module.exports.getEditPage = async (req, res, next) => {
    const { id } = req.params;
    console.log("id: ", id);
  const cafe = await Cafe.findById(id);
  console.log(cafe);
  res.render("editCafe.ejs", { cafe });
};

module.exports.editCafe = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const { name, description, price, location, image } = req.body;
  const cafe = await Cafe.findOneAndUpdate(
    {
      _id: id,
    },
    {
      name: name,
      description: description,
      price: price,
      location: location,
      image: image,
    },
    {
      new: true,
    }
  );
  if (cafe) {
    req.flash("success", "Cafe Edited Successfully");
    res.redirect(`/cafes/${id}`);
  } else {
    req.flash("error", "Edit Cafe Failed");
    res.redirect(`/cafes/${id}`);
  }
  // res.json(cafe);
  //console.log(cafe);
};

module.exports.deleteCafe = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, location } = req.body;
  const cafe = await Cafe.findOneAndDelete({ _id: id });
  if (cafe) {
    req.flash("success", "Cafe Deleted Successfully");
    res.redirect("/cafes");
  } else {
    req.flash("error", "Couldn't delete Cafe");
    res.redirect("/cafes");
  }
  // res.json(cafe);
  // console.log(cafe);
};
