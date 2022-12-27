const prisma = require("../client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");

exports.passwordReset = catchAsync(async (req, res) => {
  const result = await passwordResetEmail(req.body.email);
  res.status(200).json(result);
});

exports.passwordChange = catchAsync(async (req, res) => {
  const idToken = req.cookies["firebase token"];
  if (idToken) {
    const newPassword = req.body.newPassword;
    const result = await userPasswordChange(idToken, newPassword);
    console.log(result);
    res.status(200).json(result);
  } else {
    res.status(500).json("your token was expired. Please login again");
  }
});

exports.vocaviveSignup = catchAsync(async (req, res) => {
  const { email, password, phone, type } = req.body;

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      phone,
      type,
      vocavive: {
        create: {},
      },
    },
    include: {
      vocavive: true,
    },
  });
  if (user) {
    const accessToken = await jwt.sign(user, process.env.ACCESS_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = await jwt.sign(user, process.env.REFRESH_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "User Created Successfully",
      data: user,
      accessToken,
      refreshToken,
    });
  }
});

exports.vocaviveSignIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    const checkIntoVocavive = await prisma.user.findMany({
      where: {
        vocavive: {
          userEmail: email,
        },
      },
    });

    const userDataForToken = {
      email: user.email,
      type: user.type,
    };
    if (checkIntoVocavive) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.status(400).json("Wrong Password");
      } else {
        const accessToken = await jwt.sign(
          userDataForToken,
          process.env.ACCESS_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const refreshToken = await jwt.sign(
          userDataForToken,
          process.env.REFRESH_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          message: "login Successfully Vocavive",
          data: {
            email: user.email,
            type: user.type,
            phone: user.phone,
          },
          accessToken,
          refreshToken,
        });
      }
    } else {
      const createNewUserForVocavive = await prisma.vocavive_user.create({
        data: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      if (createNewUserForVocavive) {
        const accessToken = await jwt.sign(
          userDataForToken,
          process.env.ACCESS_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const refreshToken = await jwt.sign(
          userDataForToken,
          process.env.REFRESH_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          message: "login successfull vocavive with new user creation",
          data: {
            email: user.email,
            type: user.type,
            phone: user.phone,
          },
          accessToken,
          refreshToken,
        });
      } else {
        res.status(500).json("User create for vocavive failed");
      }
    }
  } else {
    res.status(404).json("User Not found in the database");
  }
});
exports.coursebookSignIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  console.log(user);

  if (user) {
    const checkIntoCourseBook = await prisma.user.findMany({
      where: {
        coursebook: {
          userEmail: email,
        },
      },
    });

    const userDataForToken = {
      email: user.email,
      type: user.type,
    };

    if (checkIntoCourseBook[0]) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.status(400).json("Wrong Password");
      } else {
        const accessToken = await jwt.sign(
          userDataForToken,
          process.env.ACCESS_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const refreshToken = await jwt.sign(
          userDataForToken,
          process.env.REFRESH_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          message: "login Successfully In CourseBook",
          data: {
            email: user.email,
            type: user.type,
            phone: user.phone,
          },
          accessToken,
          refreshToken,
        });
      }
    } else {
      const createNewUserForCourseBook = await prisma.coursebook_user.create({
        data: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      if (createNewUserForCourseBook) {
        const accessToken = await jwt.sign(
          userDataForToken,
          process.env.ACCESS_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const refreshToken = await jwt.sign(
          userDataForToken,
          process.env.REFRESH_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          message: "login successfull into CourseBook with new user creation",
          data: {
            email: user.email,
            type: user.type,
            phone: user.phone,
          },
          accessToken,
          refreshToken,
        });
      } else {
        res.status(500).json("User creation for CourseBook  failed");
      }
    }
  } else {
    res.status(404).json("User Not found in the database");
  }
});

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
