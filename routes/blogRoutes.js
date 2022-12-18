const express = require("express");
const router = express.Router();
const Blog = require("../controllers/blogController");

router.post("/create-blog", Blog.createBlog);
router.get("/", Blog.getAllBlog);
router
  .route("/:id")
  .get(Blog.getABlog)
  .put(Blog.updateBlog)
  .delete(Blog.deleteABlog);

router.get("/user-blog/:id", Blog.getUsersBlog);

module.exports = router;
