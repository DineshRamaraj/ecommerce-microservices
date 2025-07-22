const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class JWT {
  constructor(accessSecret, refreshSecret) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
  }

  generateTokenPair(userId, additionalPayload = {}) {
    const accessToken = jwt.sign(
      {
        id: userId,
        type: "access",
        ...additionalPayload,
      },
      this.accessSecret,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: userId,
        type: "refresh",
        random: crypto.randomBytes(16).toString("hex"),
        ...additionalPayload,
      },
      this.refreshSecret,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessSecret);
      if (decoded.type !== "access") {
        throw new Error("Invalid token type");
      }
      return decoded;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }

  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshSecret);
      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }
      return decoded;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JWT;
