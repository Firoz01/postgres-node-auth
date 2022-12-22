const prisma = require("../client");

const {
  createFirebaseUser,
  signInFirebaseUser,
  passwordResetEmail,
  userPasswordChange,
} = require("../Firebase/firebaseFunction");
const catchAsync = require("../utils/catchAsync");

exports.gcpData = catchAsync(async (req, res) => {
  const data = {
    name: "Muhammad Ishaq",
    gender: "Male",
    age: 23,
    address: {
      street: "87",
      city: "Gultari Matyal Skardu",
      state: "Gilgit Baltistan",
      postalCode: "16350",
    },
    phoneNumber: [{ type: "personal", number: "116263747" }],
  };
  res.status(200).json(data);
});

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
  console.log("api hitted");
  const { email, password, phone, type } = req.body;

  const result = await createFirebaseUser(email, password);
  console.log(result);
  res.cookie("firebase token", result.idToken);
  if (result?.email) {
    const user = await prisma.user.create({
      data: {
        email,
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
    res.status(200).json(user);
  } else {
    res.status(500).json(result);
  }
});

exports.vocaviveSignIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await signInFirebaseUser(email, password);
  console.log(result);
  res.cookie("firebase token", result.idToken);
  if (result?.email) {
    const getUser = await prisma.user.findMany({
      where: {
        vocavive: {
          userEmail: email,
        },
      },
      include: {
        vocavive: {},
      },
    });

    if (getUser.length !== 0) {
      res.status(200).json({
        status: "Success",
        message: "Signin Successfully in vocavive app",
        data: getUser,
      });
    } else {
      const getUser = prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      res.status(200).json(getUser);
    }
  } else {
    res.status(404).json("User not found");
  }
});
exports.coursebookSignIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await signInFirebaseUser(email, password);
  res.cookie("firebase token", result.idToken);
  if (result?.email) {
    const getUser = await prisma.user.findMany({
      where: {
        coursebook: {
          userEmail: email,
        },
      },
      include: {
        coursebook: {},
      },
    });

    if (getUser.length !== 0) {
      res.status(200).json({
        status: "Success",
        message: "Signin Successfully in coursebook app",
        data: getUser,
      });
    } else {
      const getUser = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
        },
      });
      if (getUser?.id) {
        const saveUserInCoursebookDb = await prisma.coursebook_user.create({
          data: {
            userId: getUser.id,
            userEmail: getUser.email,
          },
        });
        console.log(saveUserInCoursebookDb);
        res.status(200).json(saveUserInCoursebookDb);
      }
    }
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
