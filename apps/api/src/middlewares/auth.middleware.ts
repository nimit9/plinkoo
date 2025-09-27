import type { NextFunction, Request, Response } from 'express';
import type { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { UnAuthenticatedError } from '../errors';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.isAuthenticated()) {
    throw new UnAuthenticatedError(
      'You must be logged in to access this resource'
    );
  }
  next();
};

export const requireEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user as User;

  if (!req.isAuthenticated()) {
    throw new UnAuthenticatedError(
      'You must be logged in to access this resource'
    );
  }

  if (!user.emailVerified) {
    throw new UnAuthenticatedError(
      'Please verify your email before accessing this resource'
    );
  }

  next();
};
