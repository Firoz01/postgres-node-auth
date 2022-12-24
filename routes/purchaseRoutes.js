const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

router.post("/create-purchase", purchaseController.vocaviveCreatePurchase);
router.get(
  "/get-purchase-information/:id",
  purchaseController.getPurchaseInfoForVocavive
);

module.exports = router;
