import jwt from "jsonwebtoken";
import { TokenPayload, CustomSignOptions } from "../types";


const generateToken = (payload: TokenPayload): string => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const options: CustomSignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      issuer: "user-service",
      audience: "ecommerce-app",
    };

    return jwt.sign(payload, secret, options as any);
  } catch (error) {
    throw new Error("Token generation failed");
  }
};

const verifyToken = (token: string): TokenPayload => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const options = {
      issuer: "user-service",
      audience: "ecommerce-app",
    };

    return jwt.verify(token, secret, options) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    throw new Error("Token verification failed");
  }
};

const generateRefreshToken = (payload: TokenPayload): string => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const options: CustomSignOptions = {
      expiresIn: "30d",
      issuer: "user-service",
      audience: "ecommerce-app",
    };

    return jwt.sign(payload, secret, options as any);
  } catch (error) {
    throw new Error("Refresh token generation failed");
  }
};

export { generateToken, verifyToken, generateRefreshToken };
