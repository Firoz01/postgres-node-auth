const prisma = require("../client");
const catchAsync = require("../utils/catchAsync");

exports.createBlog = catchAsync(async (req, res) => {
  const newBlog = await prisma.blog.create({
    data: {
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      snippet: req.body.snippet,
      imageUrl: req.body.imageUrl,
    },
  });
  if (newBlog) {
    res.status(200).json("successfull");
  } else {
    res.status(500).json("Unsuccessfull");
  }
});

exports.getAllBlog = catchAsync(async (req, res) => {
  const blogs = await prisma.blog.findMany();
  if (blogs) {
    res.status(200).json(blogs);
  } else {
    res.status(404).json("No blog found");
  }
});

exports.getABlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (id) {
    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json("No blog found with that id");
    }
  } else {
    res.status(500).json("Must give blog Id in params");
  }
});

exports.deleteABlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (id) {
    const blog = await prisma.blog.delete({
      where: {
        id: Number(id),
      },
    });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json(`can't find any post with this id:${id}`);
    }
  }
});

exports.updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (id) {
    const updateBlog = await prisma.blog.update({
      where: {
        id: Number(id),
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        snippet: req.body.snippet,
        imageUrl: req.body.imageUrl,
      },
    });
    if (updateBlog) {
      res.status(200).json(updateBlog);
    } else {
      res.status(404).json(`Blog not found with this id:${id}`);
    }
  }
});
