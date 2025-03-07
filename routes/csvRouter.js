const express = require("express");
const csvController = require("../controllers/csvController");
const router = express.Router();

// Define a route to get the status
router.get("/", csvController.getCsv);

module.exports = router;
