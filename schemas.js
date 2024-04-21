const Joi = require("joi");

const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
});

const cafeSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string(),
    location: Joi.string().required(),
    description: Joi.string().required()
});

module.exports = { cafeSchema, reviewSchema };
