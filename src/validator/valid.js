const Joi = require("joi");

const authorValidator = Joi.object({
  fname: Joi.string().required().label("fristName"),
  lname: Joi.string().required().label("lastName"),
  title: Joi.string().valid("Mr", "Mrs", "Miss").required(),
  email: Joi.string().email().required().label("email"),
  password: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)
    .required()
    .label("password"),
});

const validLogin = Joi.object({
  email: Joi.string().email().required().label("email"),
  password: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)
    .required()
    .label("password"),
});

const blogValidator = Joi.object({
  title: Joi.string().required().label("title"),
  content: Joi.string().required().label("content"),
  image: Joi.string().label("image"),
  authorId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).label('Author ID'),
  isDeleted: Joi.boolean().default(false),
});


const updateBlog = Joi.object({
  title : Joi.string(),
  content : Joi.string(),
  image:Joi.string()
})

module.exports = { authorValidator, validLogin, blogValidator,updateBlog };
