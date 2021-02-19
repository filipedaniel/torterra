const express = require("express");

const controller = require("../../controllers/dossier.controller");
const validate = require("../../middlewares/validation");
const schemas = require("../../validations/dossier.validate");

const { auth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/", controller.getAllDossiers);
router.get("/:id", controller.getDossierById);
router.get("/slug/:slug", controller.getDossierBySlug);
router.get("/slug/:slug/posts", controller.getDossierPosts);
router.post("/", auth, validate(schemas.post, "body"), controller.postDossier);
router.patch("/:id", auth, validate(schemas.patch, "body"), controller.patchDossier);
router.delete("/:id", auth, controller.deleteDossier);

module.exports = router;
