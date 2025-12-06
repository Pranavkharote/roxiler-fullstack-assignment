const Joi = require("joi");

const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;

exports.userCreateSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  password: Joi.string().pattern(passwordPattern).required(),
  role: Joi.string().valid("SYSTEM_ADMIN", "NORMAL_USER", "STORE_OWNER").required()
});

exports.userSignupSchema = Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).required(),
    password: Joi.string().pattern(passwordPattern).required(),
  
});

exports.passwordUpdateSchema = Joi.object({
  oldPass: Joi.string().required(),
  newPass: Joi.string().pattern(passwordPattern).required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
