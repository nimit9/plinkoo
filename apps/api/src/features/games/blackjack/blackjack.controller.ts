import type { User } from '@prisma/client';
import { ApiResponse } from '@repo/common/types';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BlackjackBetSchema,
  BlackjackPlayRoundSchema,
} from '@repo/common/game-utils/blackjack/validations.js';
import type {
  BlackjackActions,
  BlackjackPlayRoundResponse,
} from '@repo/common/game-utils/blackjack/types.js';
import db from '@repo/db';
import { userManager } from '../../user/user.service';
import { blackjackManager } from './blackjack.service';

export const placeBet = async (
  req: Request,
  res: Response<ApiResponse<BlackjackPlayRoundResponse> | { message: string }>
) => {
  const { betAmount } = validateBetRequest(req.body as { betAmount: number });
  const user = req.user as User;

  await validateActiveBet(user.id);

  await validateUserBalance(user.id, betAmount);

  const game = await blackjackManager.createGame({
    betAmount: Math.round(betAmount * 100), // Convert to cents
    userId: user.id,
  });

  const dbUpdateObject = game.getDbUpdateObject();

  if (dbUpdateObject) {
    await db.bet.update(dbUpdateObject);
    if ('active' in dbUpdateObject.data) {
      blackjackManager.deleteGame(user.id);
    }
  }

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, game.getPlayRoundResponse()));
};

export const getActiveGame = async (
  req: Request,
  res: Response<ApiResponse<BlackjackPlayRoundResponse> | { message: string }>
) => {
  const userId = (req.user as User).id;
  const game = await blackjackManager.getGame(userId);

  if (!game || !game.getBet().active) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new ApiResponse(StatusCodes.NOT_FOUND, {}, 'Game not found'));
  }

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, game.getPlayRoundResponse()));
};

export const blackjackNext = async (
  req: Request,
  res: Response<ApiResponse<BlackjackPlayRoundResponse> | { message: string }>
) => {
  const { action } = validatePlayRequest(req.body as { action: string });
  const userId = (req.user as User).id;
  const game = await blackjackManager.getGame(userId);

  if (!game?.getBet().active) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiResponse(StatusCodes.BAD_REQUEST, {}, 'Game not found'));
  }

  game.playRound(action as BlackjackActions);
  const dbUpdateObject = game.getDbUpdateObject();

  if (dbUpdateObject) {
    if ('active' in dbUpdateObject.data) {
      blackjackManager.deleteGame(userId);
    }
    await db.bet.update(dbUpdateObject);
  }

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, game.getPlayRoundResponse()));
};

const validateBetRequest = (body: { betAmount: number }) => {
  const result = BlackjackBetSchema.safeParse(body);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return result.data;
};

const validateUserBalance = async (userId: string, betAmount: number) => {
  const userInstance = await userManager.getUser(userId);
  const betAmountInCents = Math.round(betAmount * 100);
  const userBalanceInCents = userInstance.getBalanceAsNumber();

  if (userBalanceInCents < betAmountInCents) {
    throw new Error('Insufficient balance');
  }
};

const validateActiveBet = async (userId: string) => {
  const game = await blackjackManager.getGame(userId);
  if (game && game.getBet().active) {
    throw new Error('You already have an active bet');
  }
};

const validatePlayRequest = (body: { action: string }) => {
  const result = BlackjackPlayRoundSchema.safeParse(body);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return result.data;
};
