import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { User } from '@prisma/client';
import { ApiResponse } from '@repo/common/types';
import type {
  PaginatedBets,
  ProvablyFairStateResponse,
} from '@repo/common/types';
import { BadRequestError } from '../../errors';
import { userManager, getUserBets } from './user.service';

export const getBalance = async (req: Request, res: Response) => {
  const userInstance = await userManager.getUser((req.user as User).id);
  const balance = userInstance.getBalance() / 100;
  return res.status(StatusCodes.OK).json({ balance });
};

export const rotateSeed = async (
  req: Request,
  res: Response<ApiResponse<ProvablyFairStateResponse>>,
) => {
  const { clientSeed } = req.body as { clientSeed: string };
  if (!clientSeed) {
    throw new BadRequestError('Client seed is required');
  }
  const userInstance = await userManager.getUser((req.user as User).id);
  const seed = await userInstance.rotateSeed(clientSeed);
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, seed));
};

export const getProvablyFairState = async (
  req: Request,
  res: Response<ApiResponse<ProvablyFairStateResponse>>,
) => {
  const userInstance = await userManager.getUser((req.user as User).id);
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      clientSeed: userInstance.getClientSeed(),
      hashedServerSeed: userInstance.getHashedServerSeed(),
      hashedNextServerSeed: userInstance.getHashedNextServerSeed(),
      nonce: userInstance.getNonce(),
    }),
  );
};

export const getRevealedServerSeed = async (
  req: Request,
  res: Response<ApiResponse<{ serverSeed: string | null }>>,
) => {
  const { hashedServerSeed } = req.params;

  if (!hashedServerSeed) {
    throw new BadRequestError('Hashed server seed is required');
  }

  const userInstance = await userManager.getUser((req.user as User).id);
  const serverSeed =
    await userInstance.getRevealedServerSeedByHash(hashedServerSeed);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, { serverSeed }));
};

export const getUserBetHistory = async (
  req: Request,
  res: Response<ApiResponse<PaginatedBets>>,
) => {
  const userId = (req.user as User).id;

  // Parse pagination parameters from query
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  // Get paginated bets
  const paginatedBets = await getUserBets({ userId, page, pageSize });

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, paginatedBets));
};
