const jwt = require("jsonwebtoken");
const prisma = require("../client");

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

exports.verifyUserWithJWT = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization !== undefined) {
    const accessToken = authorization.split("Bearer ")[1];
    try {
      const user = await jwt.verify(accessToken, process.env.ACCESS_SECRET);
      const checkUserInDB = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
        select: {
          email: true,
          type: true,
        },
      });
      if (checkUserInDB) {
        next();
      } else {
        return res.status(404).json({
          error:
            "User with this token not found in the Database. Are you hacker? tring to hack my db?",
        });
      }
    } catch (error) {
      return res.status(401).json({ error: "expire access token " });
    }
  } else {
    return res.status(401).json({ error: "unauthorized" });
  }
};
