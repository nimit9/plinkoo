import db from '@repo/db';
import type { Request, Response } from 'express';
import type { RoulettePlaceBetResponse } from '@repo/common/game-utils/roulette/index.js';
import {
  BetsSchema,
  validateBets,
} from '@repo/common/game-utils/roulette/index.js';
import { type User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '@repo/common/types';
import { sum } from 'lodash';
import { BadRequestError } from '../../../errors';
import { userManager } from '../../user/user.service';
import { calculatePayout, spinWheel } from './roulette.service';

export const placeBetAndSpin = async (
  request: Request,
  response: Response<ApiResponse<RoulettePlaceBetResponse>>,
): Promise<void> => {
  const validationResult = BetsSchema.safeParse(request.body);

  if (!validationResult.success) {
    throw new BadRequestError('Invalid request for bets');
  }

  const { bets } = validationResult.data;

  const validBets = validateBets(bets);

  if (validBets.length === 0) {
    throw new BadRequestError('No valid bets placed');
  }

  const userInstance = await userManager.getUser((request.user as User).id);
  const user = userInstance.getUser();

  const totalBetAmountInCents = Math.round(
    sum(validBets.map((bet) => bet.amount)) * 100,
  );

  if (user.balance < totalBetAmountInCents) {
    throw new BadRequestError('Insufficient balance');
  }

  const winningNumber = await spinWheel(user.id);

  const payout = calculatePayout(validBets, winningNumber);

  const gameState = {
    bets: validBets,
    winningNumber: String(winningNumber),
  };

  const payoutInCents = Math.round(payout * 100);

  const balanceChangeInCents = payoutInCents - totalBetAmountInCents;

  const { balance, id } = await db.$transaction(async (tx) => {
    const bet = await tx.bet.create({
      data: {
        active: false,
        betAmount: totalBetAmountInCents,
        betNonce: userInstance.getNonce(),
        game: 'roulette',
        payoutAmount: payoutInCents,
        provablyFairStateId: userInstance.getProvablyFairStateId(),
        state: gameState,
        userId: user.id,
      },
    });

    await userInstance.updateNonce(tx);

    const userWithNewBalance = await tx.user.update({
      where: { id: user.id },
      data: {
        balance: {
          increment: balanceChangeInCents,
        },
      },
    });

    return {
      balance: userWithNewBalance.balance,
      id: bet.id,
    };
  });

  userInstance.setBalance(balance);

  response.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      id,
      state: gameState,
      payoutMultiplier: payoutInCents / totalBetAmountInCents,
      payout: payoutInCents / 100,
      balance: userInstance.getBalance() / 100,
    }),
  );
};
