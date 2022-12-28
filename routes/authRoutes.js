const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/refresh-token", authController.refreshToken);
router.post("/password-reset", authController.passwordReset);
router.post("/password-change", authController.passwordChange);
router.post("/vocavive-signup", authController.vocaviveSignup);
router.post("/vocavive-signin", authController.vocaviveSignIn);
router.post("/coursebook-signin", authController.coursebookSignIn);
router.post("/coursebook-signup", authController.courseBookSignup);

module.exports = router;
