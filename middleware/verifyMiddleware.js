exports.authTokenVerifyMiddleware = (req, res, next) => {
  var admin = require("firebase-admin");
  let firebaseApp = null;
  var serviceAccount = require("./edvive-node-firebase-adminsdk-9hzfr-1a91eb2c4e.json");
  if (!firebaseApp) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  const tokenString = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")
    : null;
  if (!tokenString) {
    res.send("No header provided");
  } else if (!tokenString[1]) {
    res.send("no token provided");
  } else {
    const { getAuth } = require("firebase-admin/auth");
    getAuth()
      .verifyIdToken(tokenString[1])
      .then((decodedToken) => {
        console.log(decodedToken);
        const uid = decodedToken.uid;
        console.log(uid);
        next();
      })
      .catch((error) => {
        res.send(error);
      });
  }
  console.log(tokenString);
};
