const express = require("express");
const imageController = require("../controllers/imageController");
const router = express.Router();

// Example route to get an image
router.get("/", (req, res) => {
  imageController(req, res);
});

module.exports = router;
