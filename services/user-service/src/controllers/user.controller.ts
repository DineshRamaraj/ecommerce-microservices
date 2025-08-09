import { Response } from "express";
import userService from "../services/user.service";
import { successResponse, errorResponse } from "../utils/response.utils";
import { AuthenticatedRequest } from "../types";

class UserController {
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const result = await userService.register(userData);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      successResponse(
        res,
        {
          user: result.user,
          token: result.token,
        },
        "User registered successfully",
        201
      );
    } catch (error) {
      const err = error as Error;
      if (err.message === "User with this email already exists") {
        errorResponse(res, err.message, 409);
        return;
      }

      if (err.name === "ValidationError") {
        const validationError = err as any;
        const errors = Object.values(validationError.errors).map(
          (err: any) => ({
            field: err.path,
            message: err.message,
          })
        );
        errorResponse(res, "Validation failed", 400, errors);
        return;
      }

      console.error("Registration error:", error);
      errorResponse(res, "Registration failed. Please try again.", 500);
    }
  }

  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      successResponse(
        res,
        {
          user: result.user,
          token: result.token,
        },
        "Login successful"
      );
    } catch (error) {
      const err = error as Error;
      if (err.message === "Invalid credentials") {
        errorResponse(res, err.message, 401);
        return;
      }

      if (err.message.includes("Account is")) {
        errorResponse(res, err.message, 401);
        return;
      }

      console.error("Login error:", error);
      errorResponse(res, "Login failed. Please try again.", 500);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await userService.getUserById(req.user!.userId);
      successResponse(res, user, "Profile retrieved successfully");
    } catch (error) {
      const err = error as Error;
      if (err.message === "User not found") {
        errorResponse(res, err.message, 404);
        return;
      }

      console.error("Get profile error:", error);
      errorResponse(res, "Failed to retrieve profile", 500);
    }
  }

  async updateBasicProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const user = await userService.updateBasicProfile(
        req.user!.userId,
        req.body
      );
      successResponse(res, user, "Profile updated successfully");
    } catch (error) {
      const err = error as Error;
      if (err.message === "User not found") {
        errorResponse(res, err.message, 404);
        return;
      }

      console.error("Update profile error:", error);
      errorResponse(res, "Failed to update profile", 500);
    }
  }

  async changePassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(
        req.user!.userId,
        currentPassword,
        newPassword
      );

      successResponse(res, result, "Password changed successfully");
    } catch (error) {
      const err = error as Error;
      if (err.message === "User not found") {
        errorResponse(res, err.message, 404);
        return;
      }

      if (err.message === "Current password is incorrect") {
        errorResponse(res, err.message, 400);
        return;
      }

      console.error("Change password error:", error);
      errorResponse(res, "Failed to change password", 500);
    }
  }

  async getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await userService.getAllUsers(req.query);
      successResponse(res, result, "Users retrieved successfully");
    } catch (error) {
      console.error("Get all users error:", error);
      errorResponse(res, "Failed to retrieve users", 500);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken");
      successResponse(res, null, "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      errorResponse(res, "Logout failed", 500);
    }
  }
}

export default new UserController();
