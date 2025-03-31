import type { Request, Response } from 'express';
import { MinesBetSchema } from '@repo/common/game-utils/mines/validations.js';
import type { User } from '@prisma/client';
import { ApiResponse } from '@repo/common/types';
import { StatusCodes } from 'http-status-codes';
import { userManager } from '../../user/user.service';
import { minesManager } from './mines.service';

interface PlayRoundRequestBody {
  selectedTileIndex: number;
  id: string;
}

interface CashOutRequestBody {
  id: string;
}

export const startGame = async (req: Request, res: Response) => {
  const validationResult = MinesBetSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ message: validationResult.error.message });
  }

  const { betAmount, minesCount } = validationResult.data;

  const userInstance = await userManager.getUser((req.user as User).id);
  const user = userInstance.getUser();

  const betAmountInCents = Math.round(betAmount * 100);

  if (user.balance < betAmountInCents) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  const game = await minesManager.createGame({
    betAmount: betAmountInCents,
    minesCount,
    userId: user.id,
  });

  const bet = game.getBet();

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      id: bet.id,
      active: true,
      state: { mines: null, minesCount, rounds: [] },
    }),
  );
};

export const playRound = async (req: Request, res: Response) => {
  const { selectedTileIndex, id } = req.body as PlayRoundRequestBody;
  const game = await minesManager.getGame(id);
  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }
  try {
    const gameState = await game.playRound(selectedTileIndex);
    if (!gameState.active) {
      minesManager.deleteGame(id);
    }
    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, gameState));
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const cashOut = async (req: Request, res: Response) => {
  const { id } = req.body as CashOutRequestBody;
  const game = await minesManager.getGame(id);
  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }
  try {
    const gameState = await game.cashOut((req.user as User).id);
    minesManager.deleteGame(id);
    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, gameState));
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};
