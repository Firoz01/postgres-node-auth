const express = require("express");
const router = express.Router();
const parchaseController = require("../controllers/parchaseController");

router.post("/create", parchaseController.createParchase);

module.exports = router;
