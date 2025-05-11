import type { User } from '@prisma/client';
import { ApiResponse } from '@repo/common/types';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getSafeGameState } from '@repo/common/game-utils/blackjack/utils.js';
import { BlackjackBetSchema } from '@repo/common/game-utils/blackjack/validations.js';
import type { BlackjackPlayRoundResponse } from '@repo/common/game-utils/blackjack/types.js';
import { userManager } from '../../user/user.service';
import { blackjackManager } from './blackjack.service';

export const placeBet = async (
  req: Request,
  res: Response<ApiResponse<BlackjackPlayRoundResponse> | { message: string }>
) => {
  const validationResult = BlackjackBetSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          StatusCodes.BAD_REQUEST,
          {},
          validationResult.error.message
        )
      );
  }

  const { betAmount } = validationResult.data;

  const userInstance = await userManager.getUser((req.user as User).id);
  const user = userInstance.getUser();

  const betAmountInCents = Math.round(betAmount * 100);
  const userBalanceInCents = userInstance.getBalanceAsNumber();

  if (userBalanceInCents < betAmountInCents) {
    return res
      .status(400)
      .json(
        new ApiResponse(StatusCodes.BAD_REQUEST, {}, 'Insufficient balance')
      );
  }

  const game = await blackjackManager.createGame({
    betAmount: betAmountInCents,
    userId: user.id,
  });

  const bet = game.getBet();

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      id: bet.id,
      active: true,
      state: getSafeGameState(game.getGameState()),
      betAmount: betAmountInCents,
    })
  );
};

export const getActiveGame = async (
  req: Request,
  res: Response<ApiResponse<BlackjackPlayRoundResponse> | { message: string }>
) => {
  const userId = (req.user as User).id;
  const game = await blackjackManager.getGame(userId);

  if (!game) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new ApiResponse(StatusCodes.NOT_FOUND, {}, 'Game not found'));
  }

  const activeBet = game.getBet();

  if (!activeBet.active || !activeBet.state) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new ApiResponse(StatusCodes.NOT_FOUND, {}, 'Game not found'));
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      id: activeBet.id,
      active: activeBet.active,
      state: getSafeGameState(game.getGameState()),
      betAmount: activeBet.betAmount / 100,
      amountMultiplier: game.amountMultiplier,
    })
  );
};
