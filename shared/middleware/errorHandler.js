const logger = require("../utils/logger");
const ApiResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  logger.error("🔥 Unhandled Error:", {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.error(res, "Validation Error", 400, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(res, `${field} already exists`, 409);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.error(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.error(res, "Token expired", 401);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong!"
      : err.message;

  return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
