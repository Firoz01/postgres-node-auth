const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/vocavive-users", userController.getAllVocaviveUsers);
router.get("/vocavive-users/:id", userController.getAVocaviveUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getAUser);

module.exports = router;
