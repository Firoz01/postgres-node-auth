const prisma = require("../client");
const jwt = require("jsonwebtoken");
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken !== undefined) {
    try {
      const userData = await jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      );
      const checkUserInDB = await prisma.user.findUnique({
        where: {
          email: userData.email,
        },
        select: {
          email: true,
          type: true,
        },
      });
      if (checkUserInDB) {
        const accessToken = await jwt.sign(
          checkUserInDB,
          process.env.ACCESS_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const refresh = await jwt.sign(
          checkUserInDB,
          process.env.REFRESH_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("refreshToken", refresh, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ accessToken, refreshToken: refresh });
      } else {
        res
          .status(404)
          .json({
            error:
              "User with this token not found in the Database. Are you hacker? tring to hack my db?",
          });
      }
    } catch (error) {
      return res
        .status(404)
        .json({ error: "exprire refresh token please login again" });
    }
  } else {
    return res.status(404).json({ error: "empty token field" });
  }
};
