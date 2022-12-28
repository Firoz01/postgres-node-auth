const prisma = require("../client");
const { uploadImage } = require("../helper/imageUploader");
const catchAsync = require("../utils/catchAsync");

exports.createBlog = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const verifyUser = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      email: true,
    },
  });

  

  console.log(userId);
  // let imageUrl;
  // if (req?.file) {
  //   imageUrl = await uploadImage(req.file);
  //   console.log(imageUrl);
  // } else {
  //   imageUrl = null;
  // }
  // const newBlog = await prisma.blog.create({
  //   data: {
  //     userId: Number(req.body.userId),
  //     title: req.body.title,
  //     description: req.body.description,
  //     snippet: req.body.snippet,
  //     imageUrl: imageUrl,
  //   },
  // });
  // if (newBlog) {
  //   res.status(200).json({
  //     status: "Success",
  //     message: "Blog created successfully",
  //     data: newBlog,
  //   });
  // } else {
  //   res
  //     .status(500)
  //     .json({ status: "failed", message: "Blog can't be created" });
  // }
});

exports.getUsersBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  let limit = req.query.limit;
  let offset = req.query.offset;
  console.log(limit);
  if (limit == undefined) {
    limit = 10;
  }
  if (offset == undefined) {
    offset = 0;
  }

  const blogs = await prisma.user.findMany({
    where: {
      id: Number(id),
    },
    include: {
      blog: {
        skip: Number(offset),
        take: Number(limit),
      },
    },
  });
  if (blogs) {
    res.status(200).json(blogs);
  } else {
    res.status(404).json(`Can't not find any blog with this id:${id}`);
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
