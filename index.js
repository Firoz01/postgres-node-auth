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

const ErrorHandler = require("./Handler/errorHandler.js");

const { verifyUserWithJWT } = require("./middleware/verifyMiddleware.js");

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
  catchAsync(async (req, res, next) => {
    const users = { user: "Md firoz mia", age: 24, role: "developer" };
    res.status(200).json(users);
  })
);

const server = app.listen(PORT, () => {
  console.log(`The server is running at port: ${PORT}`);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/packages", packageRouter);
app.use("/api/v1/blog", verifyUserWithJWT, blogRouter);
app.use("/api/v1/vocavive/purchase", verifyUserWithJWT, purchaseRouter);
app.use("/api/v1/coursebook/purchase", verifyUserWithJWT, purchaseRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(ErrorHandler.handle());

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting Down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
