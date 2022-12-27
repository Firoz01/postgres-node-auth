const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const AppError = require("./utils/appError.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const packageRouter = require("./routes/packageRoutes");
const blogRouter = require("./routes/blogRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");
const authRouter = require("./routes/authRoutes");
const catchAsync = require("./utils/catchAsync.js");
const morgan = require("morgan");
const path = require("path");
const jwt = require("jsonwebtoken");

const { uploadImage } = require("./helper/imageUploader.js");
const {
  authTokenVerifyMiddleware,
  verifyUserWithJWT,
} = require("./middleware/verifyMiddleware.js");
const { multer } = require("./utils/multer.js");

dotenv.config({ path: path.resolve(__dirname, ".env") });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting Down...");
  console.log(err.name, err.message);

  process.exit(1);
});

const app = express();
app.use(morgan(':date[clf] ":method :url"'));
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get(
  "/",
  authTokenVerifyMiddleware,
  catchAsync(async (req, res) => {
    const users = { user: "Md firoz mia", age: 24, role: "developer" };
    res.status(200).json(users);
  })
);

const server = app.listen(PORT, () => {
  console.log(`The server is running at port: ${PORT}`);
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = {
    email: "hello@gmail.com",
    password: "abcd1234",
    name: "hello",
  };
  if (email === user.email && password === user.password) {
    const accessToken = await jwt.sign(user, process.env.ACCESS_SECRET, {
      expiresIn: "1m",
    });
    const refreshToken = await jwt.sign(user, process.env.REFRESH_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken, refreshToken });
  } else {
    return res.status(406).json({ error: "Invalid Email and password" });
  }
});

app.post("/api/test", async (req, res) => {
  const { authorization } = req.headers;
  if (authorization !== undefined) {
    const accessToken = authorization.split("Bearer ")[1];
    try {
      const user = await jwt.verify(accessToken, process.env.ACCESS_SECRET);
      return res.status(200).json({ message: "access granted" });
    } catch (error) {
      return res.status(401).json({ error: "exprire access token " });
    }
  } else {
    return res.status(401).json({ error: "unauthorized" });
  }
});

app.post("/api/refresh-token", async (req, res) => {});

app.post("/upload", multer.single("image"), async (req, res) => {
  try {
    if (req.file) {
      console.log(req.file);
      const imageUrl = await uploadImage(req.file);
      console.log(imageUrl);
      res
        .status(200)
        .json({ message: "Upload was successfully", data: imageUrl });
    } else {
      res.status(404).json("file not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/packages", packageRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/vocavive/purchase", verifyUserWithJWT, purchaseRouter);
app.use("/api/v1/coursebook/purchase", verifyUserWithJWT, purchaseRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting Down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
