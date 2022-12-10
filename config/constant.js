const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

exports.WEB_KEY = process.env.FIREBASE_WEB_API;
