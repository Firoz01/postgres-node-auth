const prisma = require("../client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const { ACCESS_SECRET, REFRESH_SECRET } = require("../config/constant");
const AppError = require("../utils/appError");

const createJwtToken = async (tokenData, res, resMessage, resData) => {
  const accessToken = await jwt.sign(tokenData, ACCESS_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = await jwt.sign(tokenData, REFRESH_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: resMessage,
    data: resData,
    accessToken,
    refreshToken,
  });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken !== undefined) {
    try {
      const userData = await jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      );
      const checkUserInDB = await prisma.user.findUnique({
        where: {
          email: userData.email,
        },
        select: {
          email: true,
          type: true,
        },
      });
      if (checkUserInDB) {
        createJwtToken(
          checkUserInDB,
          res,
          "New Access Token And Refresh Token Generated",
          checkUserInDB
        );
      } else {
        res.status(404).json({
          error:
            "User with this token not found in the Database. Are you hacker? tring to hack my db?",
        });
      }
    } catch (error) {
      return res
        .status(404)
        .json({ error: "exprire refresh token please login again" });
    }
  } else {
    return res.status(404).json({ error: "empty token field" });
  }
};

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

  const userDataForToken = {
    email: user.email,
    type: user.type,
  };

  if (user) {
    createJwtToken(
      userDataForToken,
      res,
      "User Created Successfully and login into vocavive",
      user
    );
  } else {
    res
      .status(500)
      .json("Server failed when tring to create New user to the database");
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
        createJwtToken(
          userDataForToken,
          res,
          "login Successfull into Vocavive",
          { email: user.email, type: user.type, phone: user.phone }
        );
      }
    } else {
      const createNewUserForVocavive = await prisma.vocavive_user.create({
        data: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      if (createNewUserForVocavive) {
        createJwtToken(
          userDataForToken,
          res,
          "login successfull vocavive with new user creation",
          { email: user.email, type: user.type, phone: user.phone }
        );
      } else {
        res.status(500).json("User creation for vocavive failed");
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
        createJwtToken(
          userDataForToken,
          res,
          "login Successfully In CourseBook",
          { email: user.email, type: user.type, phone: user.phone }
        );
      }
    } else {
      const createNewUserForCourseBook = await prisma.coursebook_user.create({
        data: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      if (createNewUserForCourseBook) {
        createJwtToken(
          userDataForToken,
          res,
          "login successfull into CourseBook with new Coursebook user creation",
          { email: user.email, type: user.type, phone: user.phone }
        );
      } else {
        res.status(500).json("User creation for CourseBook  failed");
      }
    }
  } else {
    res.status(404).json("User Not found in the database");
  }
});

exports.courseBookSignup = catchAsync(async (req, res) => {
  const { email, password, phone, type } = req.body;

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      phone,
      type,
      coursebook: {
        create: {},
      },
    },
    include: {
      coursebook: true,
    },
  });

  const userDataForToken = {
    email: user.email,
    type: user.type,
  };

  if (user) {
    createJwtToken(
      userDataForToken,
      res,
      "User Created Successfully and login into coursebook",
      user
    );
  } else {
    res
      .status(500)
      .json("Server failed when tring to create New user to the database");
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please Log in to grant acess", 401)
    );
  }
  const decoded = await jwt.verify(token, ACCESS_SECRET);
  const currentUser = await prisma.user.findUnique({
    where: {
      email: decoded.email,
    },
    select: {
      email: true,
      type: true,
    },
  });

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  req.user = currentUser;
  next();
});
