const Joi = require("@hapi/joi");

const userSchemas = {
  registerValidation: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    role: Joi.optional()
  }),
  updateValidation: Joi.object().keys({
    name: Joi.string().min(1).optional(),
    role: Joi.optional(),
    password: Joi.string().required().min(5).optional(),
  }),
  loginValidation: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  updatePasswordValidation: Joi.object().keys({
    oldPassword: Joi.string().required().min(5),
    newPassword: Joi.string().required().min(5)
  }),
  resetPassword: Joi.object().keys({
    email: Joi.string().required().email()
  })
};

module.exports = userSchemas;
