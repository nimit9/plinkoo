import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.isAuthenticated()) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'You must be logged in to access this resource',
    });
    return;
  }
  next();
};
