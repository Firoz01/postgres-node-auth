const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const AppError = require("./utils/appError.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const packageRouter = require("./routes/packageRoutes");
const catchAsync = require("./utils/catchAsync.js");
const morgan = require("morgan");
const path = require("path");

const Multer = require("multer");
const { uploadImage } = require("./helper/helper.js");


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
  catchAsync(async (req, res) => {
    const users = { user: "Md firoz mia", age: 24, role: "developer" };
    res.status(200).json(users);
  })
);

const server = app.listen(PORT, () => {
  console.log(`The server is running at port: ${PORT}`);
});

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/packages", packageRouter);

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
