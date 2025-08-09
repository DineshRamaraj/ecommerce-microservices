import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
require("dotenv").config();

import connectDB from "./config/database";
import userRoutes from "./routes/user.routes";
import { errorResponse } from "./utils/response.utils";

const app: Express = express();

// Connect to MongoDB
connectDB();

// MIDDLEWARE
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use((req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(30000);
  next();
});

// ROUTES
app.get("/health", (req: Request, res: Response) => {
  const healthInfo = {
    success: true,
    message: "User Service is running",
    timestamp: new Date().toISOString(),
    service: {
      name: "user-service",
      version: "1.0.0",
      description: "User authentication and management service",
    },
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3001,
    database: {
      status: "connected",
      name: "users_db",
    },
    features: [
      "User registration and login",
      "JWT authentication",
      "Role-based authorization",
      "Password encryption",
      "Account lockout protection",
      "Basic profile management",
    ],
  };

  res.status(200).json(healthInfo);
});

app.use("/api/users", userRoutes);

// ERROR HANDLING
app.use("*", (req: Request, res: Response) => {
  errorResponse(res, `Route ${req.method} ${req.originalUrl} not found`, 404, [
    {
      message:
        "Available routes: POST /api/users/register, POST /api/users/login, GET /api/users/profile, GET /health",
    },
  ]);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error handler:", err.stack);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error: any) => ({
      field: error.path,
      message: error.message,
    }));
    errorResponse(res, "Validation failed", 400, errors);
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = Object.values(err.keyValue)[0];
    errorResponse(res, `${field} '${value}' already exists`, 409);
    return;
  }

  if (err.name === "JsonWebTokenError") {
    errorResponse(res, "Invalid token", 401);
    return;
  }

  if (err.name === "TokenExpiredError") {
    errorResponse(res, "Token expired", 401);
    return;
  }

  if (err.name === "MongoNetworkError") {
    errorResponse(res, "Database connection failed", 503);
    return;
  }

  errorResponse(res, "Internal server error", 500);
});

// SERVER STARTUP
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(
    "================================================================"
  );
  console.log("🚀 USER SERVICE STARTED SUCCESSFULLY");
  console.log(
    "================================================================"
  );
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 Database: users_db`);
  console.log(`🎯 Purpose: User authentication and management`);
  console.log(
    "================================================================"
  );
  console.log("📋 Available Endpoints:");
  console.log("   POST /api/users/register     - Register new user");
  console.log("   POST /api/users/login        - User login");
  console.log("   GET  /api/users/profile      - Get user profile");
  console.log("   PUT  /api/users/profile      - Update profile");
  console.log("   POST /api/users/change-password - Change password");
  console.log("   GET  /api/users              - Get all users (admin)");
  console.log("   GET  /health                 - Health check");
  console.log(
    "================================================================"
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

export default app;
