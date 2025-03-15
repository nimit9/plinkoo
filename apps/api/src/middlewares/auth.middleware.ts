import type { NextFunction, Request, Response } from 'express';
import { UnAuthenticatedError } from '../errors';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.isAuthenticated()) {
    throw new UnAuthenticatedError('Unauthorized');
  }
  next();
};
