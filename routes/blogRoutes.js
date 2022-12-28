const express = require("express");
const router = express.Router();
const Blog = require("../controllers/blogController");
const AuthController = require("../controllers/authController");
const { verifyUserWithJWT } = require("../middleware/verifyMiddleware");
const { multer } = require("../utils/multer");

router.post(
  "/create-blog",
  verifyUserWithJWT,
  multer.single("imageUrl"),
  Blog.createBlog
);
router.get("/", AuthController.protect, Blog.getAllBlog);
router
  .route("/:id")
  .get(Blog.getABlog)
  .put(Blog.updateBlog)
  .delete(Blog.deleteABlog);

router.get("/user-blog/:id", verifyUserWithJWT, Blog.getUsersBlog);

module.exports = router;
