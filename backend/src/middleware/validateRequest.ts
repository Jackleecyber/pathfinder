import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { createValidationError } from './errorHandler';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }));

    const error = createValidationError('Validation failed');
    (error as any).details = errorMessages;
    return next(error);
  }

  next();
};
