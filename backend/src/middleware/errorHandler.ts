import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { config } from '../config';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let details: any = undefined;

  // Log the error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
  });

  // Handle specific error types
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = 'Database operation failed';
    
    switch (error.code) {
      case 'P2002':
        message = 'Duplicate entry found';
        details = { field: error.meta?.target };
        break;
      case 'P2025':
        message = 'Record not found';
        break;
      case 'P2003':
        message = 'Foreign key constraint failed';
        break;
      case 'P2014':
        message = 'Invalid relation';
        break;
      default:
        message = 'Database error occurred';
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = 'Database connection failed';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = error.message;
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
    
    switch (error.message) {
      case 'File too large':
        message = 'File size exceeds limit';
        break;
      case 'Unexpected field':
        message = 'Invalid file field';
        break;
      case 'Too many files':
        message = 'Too many files uploaded';
        break;
    }
  }

  // Don't expose internal errors in production
  if (config.nodeEnv === 'production' && !error.isOperational) {
    message = 'Something went wrong';
    details = undefined;
  }

  // Send error response
  const errorResponse: any = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    errorResponse.details = details;
  }

  // Include stack trace in development
  if (config.nodeEnv === 'development') {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Common error creators
export const createError = (message: string, statusCode: number = 500): CustomError => {
  return new CustomError(message, statusCode);
};

export const createValidationError = (message: string): CustomError => {
  return new CustomError(message, 400);
};

export const createUnauthorizedError = (message: string = 'Unauthorized'): CustomError => {
  return new CustomError(message, 401);
};

export const createForbiddenError = (message: string = 'Forbidden'): CustomError => {
  return new CustomError(message, 403);
};

export const createNotFoundError = (message: string = 'Not found'): CustomError => {
  return new CustomError(message, 404);
};

export const createConflictError = (message: string): CustomError => {
  return new CustomError(message, 409);
};

export const createTooManyRequestsError = (message: string = 'Too many requests'): CustomError => {
  return new CustomError(message, 429);
};
