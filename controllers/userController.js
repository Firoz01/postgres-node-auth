const prisma = require("../client");

const catchAsync = require("../utils/catchAsync");


exports.getAllUsers = catchAsync(async (req, res) => {
  console.log("user api hitted");
  const users = await prisma.user.findMany();
  console.log("user data", users);
  res.status(200).json(users);
});

exports.getAUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findMany({
    where: {
      id: parseInt(id),
    },
    include: {
      vocavive: {},
    },
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json(`user not found with this id:${id}`);
  }
});

exports.getAllVocaviveUsers = catchAsync(async (req, res) => {
  let limit = req.query.limit;
  if (limit == undefined) {
    limit = 10;
  }
  const users = await prisma.vocavive_user.findMany({ take: Number(limit) });
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json("Empty List");
  }
});

exports.getAVocaviveUser = catchAsync(async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  const user = await prisma.vocavive_user.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      parchase: {},
    },
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json("Empty List");
  }
});
