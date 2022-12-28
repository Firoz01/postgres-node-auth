const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

exports.WEB_KEY = process.env.FIREBASE_WEB_API;

exports.ACCESS_SECRET = process.env.ACCESS_SECRET;

exports.REFRESH_SECRET = process.env.REFRESH_SECRET;
