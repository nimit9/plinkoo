import type { Request, Response } from 'express';
import type { KenoResponse } from '@repo/common/game-utils/keno/types.js';
import { KenoRequestSchema } from '@repo/common/game-utils/keno/types.js';
import type { User } from '@prisma/client';
import db from '@repo/db';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '@repo/common/types';
import { BadRequestError } from '../../../errors';
import { userManager } from '../../user/user.service';
import { getResult } from './keno.service';

export const placeBet = async (
  req: Request,
  res: Response<ApiResponse<KenoResponse>>
) => {
  const parsedRequest = KenoRequestSchema.safeParse(req.body);
  if (!parsedRequest.success) {
    throw new BadRequestError('Invalid request body');
  }
  const { betAmount, selectedTiles, risk } = parsedRequest.data;

  const userInstance = await userManager.getUser((req.user as User).id);
  const user = userInstance.getUser();

  const betAmountInCents = Math.round(betAmount * 100);

  const userBalanceInCents = userInstance.getBalanceAsNumber();

  if (userBalanceInCents < betAmountInCents) {
    throw new BadRequestError('Insufficient balance');
  }

  const result = getResult({ userInstance, selectedTiles, risk });

  const { payoutMultiplier } = result;

  const payoutInCents =
    payoutMultiplier > 0 ? Math.round(betAmountInCents * payoutMultiplier) : 0;
  const balanceChangeInCents = payoutInCents - betAmountInCents;

  // Update balance and create bet in a single transaction
  const { balance, id } = await db.$transaction(async tx => {
    // Create bet record with amounts in cents
    const bet = await tx.bet.create({
      data: {
        active: false,
        betAmount: betAmountInCents,
        betNonce: userInstance.getNonce(),
        game: 'keno',
        payoutAmount: payoutInCents,
        provablyFairStateId: userInstance.getProvablyFairStateId(),
        state: result.state,
        userId: user.id,
      },
    });

    await userInstance.updateNonce(tx);

    // Calculate new balance as a string
    const newBalance = (userBalanceInCents + balanceChangeInCents).toString();

    // Update user balance with the balance change in cents
    const userWithNewBalance = await tx.user.update({
      where: { id: user.id },
      data: {
        balance: newBalance,
      },
    });

    return { balance: userWithNewBalance.balance, id: bet.id };
  });

  // Update the user instance with new balance
  userInstance.setBalance(balance);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      ...result,
      balance: userInstance.getBalanceAsNumber() / 100, // Convert back to dollars for the response
      id,
      payout: payoutInCents / 100, // Convert back to dollars for the response
    })
  );
};
