import type { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AuthenticatedRequest } from '../types';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.isAuthenticated()) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'You must be logged in to access this resource',
    });
  }
  next();
};
