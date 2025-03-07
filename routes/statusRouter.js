const express = require("express");
const statusController = require("../controllers/statusController");
const router = express.Router();

// Define a route to get the status
router.get("/", statusController.getStatus);

module.exports = router;
