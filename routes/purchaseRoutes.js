const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

router.post("/create-purchase", purchaseController.createPurchase);

module.exports = router;
