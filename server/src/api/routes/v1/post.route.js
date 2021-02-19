const express = require("express");

const controller = require("../../controllers/post.controller");
const validate = require("../../middlewares/validation");
const schemas = require("../../validations/post.validate");

const { auth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/", controller.getAllPosts);
router.get("/:id", controller.getPostById);
router.get("/slug/:slug", controller.getPostBySlug);
router.post("/", auth, validate(schemas.post), controller.postPost);
router.patch("/:id", auth, validate(schemas.patch), controller.patchPost);
router.delete("/:id", auth, controller.deletePost);

module.exports = router;
