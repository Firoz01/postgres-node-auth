const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/vocavive-signup", userController.vocaviveSignup);
router.post("/vocavive-signin", userController.vocaviveSignIn);
router.post("/coursebook-signin", userController.coursebookSignIn);
router.get("/vocavive-users", userController.getAllVocaviveUsers);
router.get("/vocavive-users/:id", userController.getAVocaviveUser);
router.get("/", userController.getAllUsers);
router.route("/:id").get(userController.getAUser);

module.exports = router;
