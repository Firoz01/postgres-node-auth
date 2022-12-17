const Cloud = require("@google-cloud/storage");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const serviceKey = path.join(__dirname, "../mykey.json");

const { Storage } = Cloud;

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.PROJECT_ID,
});

module.exports = storage;
