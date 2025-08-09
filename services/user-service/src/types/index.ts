import { Request } from "express";
import { Document } from "mongoose";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export interface UserData {
  email: string;
  password: string;
  role: "customer" | "admin" | "vendor";
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface CustomSignOptions {
  expiresIn?: string | number;
  issuer?: string;
  audience?: string | string[];
  subject?: string;
  notBefore?: string | number;
  jwtid?: string;
  algorithm?: string;
  keyid?: string;
  header?: object;
  encoding?: string;
}

export interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Export IUser interface for use across modules
export interface IUser extends Document {
  email: string;
  password: string;
  role: "customer" | "admin" | "vendor";
  status: "active" | "inactive" | "suspended" | "pending";
  emailVerified: boolean;
  lastLogin?: Date;
  basicProfile: {
    firstName: string;
    lastName: string;
  };
  loginAttempts: number;
  lockUntil?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isLocked: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<any>;
  resetLoginAttempts(): Promise<any>;
}

// Service return types
export interface UserRegistrationResult {
  user: any;
  token: string;
  refreshToken: string;
}

export interface UserLoginResult {
  user: any;
  token: string;
  refreshToken: string;
}

export interface UserListResult {
  data: any[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PasswordChangeResult {
  message: string;
}
