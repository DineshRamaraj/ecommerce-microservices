import { Response } from 'express';

interface ErrorDetail {
  field?: string;
  message: string;
  path?: string[];
  context?: { key: string };
}

/**
 * Send success response
 */
const successResponse = (
  res: Response, 
  data: any = null, 
  message: string = 'Success', 
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    service: 'user-service'
  });
};

/**
 * Send error response
 */
const errorResponse = (
  res: Response, 
  message: string = 'Something went wrong', 
  statusCode: number = 500, 
  errors: ErrorDetail[] | null = null
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
    service: 'user-service'
  });
};

/**
 * Send validation error response
 */
const validationErrorResponse = (res: Response, errors: ErrorDetail[]): Response => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.map(error => ({
      field: error.path?.join('.') || error.context?.key,
      message: error.message
    })),
    timestamp: new Date().toISOString(),
    service: 'user-service'
  });
};

export {
  successResponse,
  errorResponse,
  validationErrorResponse
};