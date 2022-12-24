const util = require("util");
const gc = require("./config");
const bucket = gc.bucket("blog-site-storage"); // should be your bucket name

const { format } = util;

exports.uploadImage = (file) =>
  new Promise((resolve, reject) => {
    console.log(file);
    const { originalname, buffer } = file;

    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });
