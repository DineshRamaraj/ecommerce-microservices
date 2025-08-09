import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { errorResponse } from '../utils/response.utils';
import User from '../models/user.model';
import { AuthenticatedRequest } from '../types';

/**
 * Authentication middleware
 */
const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Access token required. Please provide a valid Bearer token.', 401);
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.userId).select('email role status');
    if (!user) {
      errorResponse(res, 'User associated with this token no longer exists', 401);
      return;
    }

    if (user.status !== 'active') {
      errorResponse(res, `Account is ${user.status}. Please contact support.`, 401);
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    const err = error as Error;
    if (err.message === 'Invalid token') {
      errorResponse(res, 'Invalid token. Please login again.', 401);
      return;
    }
    if (err.message === 'Token expired') {
      errorResponse(res, 'Token expired. Please login again.', 401);
      return;
    }
    errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Authorization middleware
 */
const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      errorResponse(res, `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`, 403);
      return;
    }

    next();
  };
};

export {
  authenticate,
  authorize
};