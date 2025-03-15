import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import type { User } from '@prisma/client';
import { BadRequestError } from '../../errors';
import { userManager } from './user.service';

export const getBalance = async (req: Request, res: Response) => {
  const userInstance = await userManager.getUser((req.user as User).id);
  const balance = userInstance.getBalance();
  return res.status(StatusCodes.OK).json({ balance });
};

export const rotateSeed = async (req: Request, res: Response) => {
  const { clientSeed } = req.body as { clientSeed: string };
  if (!clientSeed) {
    throw new BadRequestError('Client seed is required');
  }
  const userInstance = await userManager.getUser((req.user as User).id);
  const seed = await userInstance.rotateSeed(clientSeed);
  return res.status(StatusCodes.OK).json({ seed });
};

export const getProvablyFairState = async (req: Request, res: Response) => {
  const userInstance = await userManager.getUser((req.user as User).id);
  return res.status(StatusCodes.OK).json({
    clientSeed: userInstance.getClientSeed(),
    hashedServerSeed: userInstance.getHashedServerSeed(),
    hashedNextServerSeed: userInstance.getHashedNextServerSeed(),
    nonce: userInstance.getNonce(),
  });
};
