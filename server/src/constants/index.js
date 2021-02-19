require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
  databaseURL: process.env.MONGODB_URI,
  env: process.env.ENVIREMENT,
  port: process.env.PORT,
  logs: process.env.LOGS,
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM
  }
};
