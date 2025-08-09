import User from "../models/user.model";
import { generateToken, generateRefreshToken } from "../utils/jwt.utils";
import axios from "axios";
import {
  UserData,
  TokenPayload,
  QueryParams,
  UserRegistrationResult,
  UserLoginResult,
  UserListResult,
  PasswordChangeResult,
  IUser,
} from "../types";

class UserService {
  async register(userData: UserData): Promise<UserRegistrationResult> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const user = new User({
        email: userData.email,
        password: userData.password,
        role: userData.role,
        basicProfile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      });

      await user.save();

      const tokenPayload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const token = generateToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      await this.createRoleSpecificProfile(user, userData);

      return {
        user: user.toJSON(),
        token,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<UserLoginResult> {
    try {
      const user = await User.findOne({ email }).select(
        "+password +loginAttempts +lockUntil"
      );
      if (!user) {
        throw new Error("Invalid credentials");
      }

      if (user.isLocked) {
        await user.incLoginAttempts();
        throw new Error(
          "Account is temporarily locked due to too many failed login attempts. Please try again later."
        );
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await user.incLoginAttempts();
        throw new Error("Invalid credentials");
      }

      if (user.status !== "active") {
        throw new Error(`Account is ${user.status}. Please contact support.`);
      }

      if (user.loginAttempts && user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      user.lastLogin = new Date();
      await user.save();

      const tokenPayload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const token = generateToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      return {
        user: user.toJSON(),
        token,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async updateBasicProfile(
    userId: string,
    updateData: Partial<{ firstName: string; lastName: string }>
  ): Promise<any> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] !== undefined) {
          (user.basicProfile as any)[key] =
            updateData[key as keyof typeof updateData];
        }
      });

      await user.save();
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<PasswordChangeResult> {
    try {
      const user = await User.findById(userId).select("+password");
      if (!user) {
        throw new Error("User not found");
      }

      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      user.password = newPassword;
      await user.save();

      return { message: "Password changed successfully" };
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(query: QueryParams): Promise<UserListResult> {
    try {
      const {
        page = "1",
        limit = "10",
        search = "",
        role,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const mongoQuery: any = {};

      if (search) {
        mongoQuery.$or = [
          { email: { $regex: search, $options: "i" } },
          { "basicProfile.firstName": { $regex: search, $options: "i" } },
          { "basicProfile.lastName": { $regex: search, $options: "i" } },
        ];
      }

      if (role) mongoQuery.role = role;
      if (status) mongoQuery.status = status;

      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      const users = await User.find(mongoQuery)
        .select(
          "-password -loginAttempts -lockUntil -resetPasswordToken -resetPasswordExpires"
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await User.countDocuments(mongoQuery);

      return {
        data: users.map((user) => user.toJSON()),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  private async createRoleSpecificProfile(
    user: IUser,
    userData: UserData
  ): Promise<void> {
    try {
      const serviceUrls: Record<string, string> = {
        customer: process.env.CUSTOMER_SERVICE_URL || "http://localhost:3002",
        admin: process.env.ADMIN_SERVICE_URL || "http://localhost:3003",
        vendor: process.env.VENDOR_SERVICE_URL || "http://localhost:3004",
      };

      const serviceUrl = serviceUrls[user.role];
      if (serviceUrl) {
        const profileData = {
          userId: user._id.toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone || null,
        };

        try {
          await axios.post(
            `${serviceUrl}/api/${user.role}s/create-profile`,
            profileData,
            {
              timeout: 5000,
              headers: {
                "Content-Type": "application/json",
                "X-Service-Auth": "user-service",
              },
            }
          );
          console.log(`✅ ${user.role} profile created for user ${user._id}`);
        } catch (error) {
          console.log(
            `⚠️ ${user.role} service not available yet (this is expected for now)`
          );
        }
      }
    } catch (error) {
      console.error(
        `❌ Failed to create ${user.role} profile:`,
        (error as Error).message
      );
    }
  }
}

export default new UserService();
