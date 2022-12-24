const express = require("express");
const router = express.Router();
const Blog = require("../controllers/blogController");
const { multer } = require("../utils/multer");

router.post("/create-blog", multer.single("imageUrl"), Blog.createBlog);
router.get("/", Blog.getAllBlog);
router
  .route("/:id")
  .get(Blog.getABlog)
  .put(Blog.updateBlog)
  .delete(Blog.deleteABlog);

router.get("/user-blog/:id", Blog.getUsersBlog);

module.exports = router;
