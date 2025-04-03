import type { Request, Response } from 'express';
import { MinesBetSchema } from '@repo/common/game-utils/mines/validations.js';
import type { User } from '@prisma/client';
import { ApiResponse } from '@repo/common/types';
import { StatusCodes } from 'http-status-codes';
import type {
  MinesGameOverResponse,
  MinesHiddenState,
  MinesPlayRoundResponse,
} from '@repo/common/game-utils/mines/types.js';
import { userManager } from '../../user/user.service';
import { minesManager } from './mines.service';

interface PlayRoundRequestBody {
  selectedTileIndex: number;
  id: string;
}

export const startGame = async (
  req: Request,
  res: Response<ApiResponse<MinesPlayRoundResponse> | { message: string }>,
) => {
  const validationResult = MinesBetSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          StatusCodes.BAD_REQUEST,
          {},
          validationResult.error.message,
        ),
      );
  }

  const { betAmount, minesCount } = validationResult.data;

  const userInstance = await userManager.getUser((req.user as User).id);
  const user = userInstance.getUser();

  const betAmountInCents = Math.round(betAmount * 100);

  if (user.balance < betAmountInCents) {
    return res
      .status(400)
      .json(
        new ApiResponse(StatusCodes.BAD_REQUEST, {}, 'Insufficient balance'),
      );
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
      betAmount: betAmountInCents,
    }),
  );
};

export const playRound = async (
  req: Request,
  res: Response<
    | ApiResponse<MinesPlayRoundResponse | MinesGameOverResponse | undefined>
    | { message: string }
  >,
) => {
  const userInstance = await userManager.getUser((req.user as User).id);
  const user = userInstance.getUser();

  const { selectedTileIndex } = req.body as PlayRoundRequestBody;
  const game = await minesManager.getGame(user.id);

  if (!game?.getBet().active) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiResponse(StatusCodes.BAD_REQUEST, {}, 'Game not found'));
  }

  const gameState = await game.playRound(selectedTileIndex);
  if (!gameState.active) {
    minesManager.deleteGame(user.id);
  }
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, gameState));
};

export const cashOut = async (
  req: Request,
  res: Response<
    ApiResponse<MinesGameOverResponse | undefined> | { message: string }
  >,
) => {
  const userId = (req.user as User).id;
  const game = await minesManager.getGame(userId);
  if (!game?.getBet().active) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiResponse(StatusCodes.BAD_REQUEST, {}, 'Game not found'));
  }

  const gameState = await game.cashOut(userId);
  minesManager.deleteGame(userId);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, gameState));
};

export const getActiveGame = async (
  req: Request,
  res: Response<
    ApiResponse<MinesPlayRoundResponse | undefined> | { message: string }
  >,
) => {
  const userId = (req.user as User).id;
  const game = await minesManager.getGame(userId);

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
      state: {
        mines: null,
        rounds: game.getRounds(),
        minesCount: (activeBet.state as MinesHiddenState).minesCount,
      },
      betAmount: activeBet.betAmount / 100,
    }),
  );
};
