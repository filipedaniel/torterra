const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");

const { jwtSecret } = require("../../constants");

exports.auth = (req, res, next) => {
  let token = req.headers.authorization;
  // console.log(token);
  if (!token)
    return next(new APIError({
      message: "Acesso negado!",
      status: httpStatus.UNAUTHORIZED
    }));

  try {
    token = token.split(" ")[1];
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    next(new APIError({
      message: `Acesso negado! - ${err.message}`,
      status: httpStatus.UNAUTHORIZED
    }));
  }
};
