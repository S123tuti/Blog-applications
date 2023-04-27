
const Joi = require('joi');

const userValidator = Joi.object({
  fname: Joi.string().required().label("fristName"),
  lname: Joi.string().required().label("lastName"),
  title: Joi.string().valid('Mr', 'Mrs', 'Miss').required(),
  email: Joi.string().email().required().label("email"),
  password: Joi.string().required().label("password")
});


const Joi = require('joi');

const blogValidator = Joi.object({
  title: Joi.string().required().label("title"),
  content: Joi.string().required().label("content"),
  image: Joi.string().image("image"),
  authorId: Joi.string().required().label('authorId'),
  isDeleted: Joi.boolean().default(false)
});



module.exports= {userValidator,blogValidator}





