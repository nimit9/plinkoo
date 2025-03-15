import type { User } from '@prisma/client';
import type { DiceCondition } from '@repo/common/game-utils/dice/types.js';
import type { Request, Response } from 'express';
import { BadRequestError } from '../../../errors';
import { userManager } from '../../user/user.service';
import { getResult } from './dice.service';

interface DiceRequestBody {
  target: number;
  condition: DiceCondition;
  betAmount: number;
}

export const placeBet = async (req: Request, res: Response) => {
  const { target, condition, betAmount } = req.body as DiceRequestBody;
  const user = req.user as User;

  if (betAmount <= 0) {
    throw new BadRequestError('Bet amount must be greater than 0');
  }

  const userInstance = await userManager.getUser(user.id);
  if (userInstance.user.balance < betAmount) {
    throw new BadRequestError('Insufficient balance');
  }

  const result = await getResult({ userId: user.id, target, condition });

  // Calculate payout and update balance
  const payout =
    result.payoutMultiplier > 0 ? betAmount * result.payoutMultiplier : 0;
  const balanceChange = payout - betAmount;
  await userInstance.updateBalance(balanceChange);

  res.status(200).json({
    ...result,
    payout,
    balance: userInstance.user.balance,
  });
};
