const express = require("express");

const dossierRoutes = require("./dossier.route");
const postRoutes = require("./post.route");
const userRoutes = require("./user.route");

const router = express.Router();

/* GET v1/status */
router.get("/status", (req, res) => {
  res.json({
    message: "OK",
    timestamp: new Date().toISOString(),
    api: {
      v1: "/api/v1/"
    }
  });
});

/* All Routes */
router.use("/dossier", dossierRoutes);
router.use("/post", postRoutes);
router.use("/user", userRoutes);

module.exports = router;
