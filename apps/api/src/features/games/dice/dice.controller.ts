import type { User } from '@prisma/client';
import type {
  DiceCondition,
  DicePlaceBetResponse,
} from '@repo/common/game-utils/dice/types.js';
import type { Request, Response } from 'express';
import db from '@repo/db';
import { ApiResponse } from '@repo/common/types';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../../errors';
import { userManager } from '../../user/user.service';
import { getResult } from './dice.service';

interface DiceRequestBody {
  target: number;
  condition: DiceCondition;
  betAmount: number;
}

export const placeBet = async (
  req: Request,
  res: Response<ApiResponse<DicePlaceBetResponse>>,
) => {
  const { target, condition, betAmount } = req.body as DiceRequestBody;

  if (betAmount <= 0) {
    throw new BadRequestError('Bet amount must be greater than 0');
  }

  const userInstance = await userManager.getUser((req.user as User).id);
  const user = userInstance.getUser();

  if (user.balance < betAmount) {
    throw new BadRequestError('Insufficient balance');
  }

  const result = getResult({ userInstance, target, condition });

  const { payoutMultiplier } = result;
  const payout = payoutMultiplier > 0 ? betAmount * payoutMultiplier : 0;
  const balanceChange = payout - betAmount;

  // Update balance and create bet in a single transaction
  const { balance, id } = await db.$transaction(async (tx) => {
    // Create bet record
    const bet = await tx.bet.create({
      data: {
        active: false,
        betAmount,
        betNonce: userInstance.getNonce(),
        game: 'dice',
        payoutAmount: payout,
        provablyFairStateId: userInstance.getProvablyFairStateId(),
        state: result.state,
        type: condition,
        userId: user.id,
      },
    });

    await userInstance.updateNonce(tx);

    // Update user balance
    const userWithNewBalance = await tx.user.update({
      where: { id: user.id },
      data: {
        balance: {
          increment: balanceChange * 100,
        },
      },
    });

    return { balance: userWithNewBalance.balance, id: bet.id };
  });

  // Update the user instance with new balance
  userInstance.setBalance(balance);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      ...result,
      balance: userInstance.getBalance() / 100,
      id,
      payout,
    }),
  );
};
