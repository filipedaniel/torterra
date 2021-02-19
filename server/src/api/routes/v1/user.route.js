const express = require("express");

const controller = require("../../controllers/user.controller");
const validate = require("../../middlewares/validation");
const { registerValidation, loginValidation, updateValidation, updatePasswordValidation, resetPassword } = require("../../validations/user.validate");
const { auth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/current/info", auth, controller.getUserInfo);
router.get("/", auth, controller.getAllUsers);
router.post("/password/reset", validate(resetPassword), controller.resetPassword);
router.post("/register", auth, validate(registerValidation), controller.register);
router.post("/login", validate(loginValidation), controller.login);
router.patch("/:id", auth, validate(updateValidation), controller.patchUser);
router.delete("/:id", auth, controller.delete);

module.exports = router;
