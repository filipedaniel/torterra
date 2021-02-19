const Joi = require("@hapi/joi");
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");


const validation = (schema, property) => (req, res, next) => {
  const { error } = Joi.validate(req[property || "body"], schema);

  const valid = error == null;
  if (valid)
    next();
  else {
    const { details } = error;
    const message = details.map((i) => i.message).join("; ");
    return next(new APIError({
      message: message,
      status: httpStatus.BAD_REQUEST
    }));
  }
};

module.exports = validation;
