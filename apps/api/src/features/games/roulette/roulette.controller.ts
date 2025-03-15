import type { Request, Response } from 'express';
import {
  BetsSchema,
  type RouletteBet,
  validateBets,
} from '@repo/common/game-utils/roulette/index.js';
import { type User } from '@prisma/client';
import { BadRequestError } from '../../../errors';
import { calculatePayout, spinWheel } from './roulette.service';

export const placeBetAndSpin = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const validationResult = BetsSchema.safeParse(request.body);

  if (!validationResult.success) {
    throw new BadRequestError('Invalid request for bets');
  }

  const { bets } = validationResult.data as { bets: RouletteBet[] };

  const validBets = validateBets(bets);

  if (validBets.length === 0) {
    throw new BadRequestError('No valid bets placed');
  }

  const user = request.user as User;

  const winningNumber = await spinWheel(user.id);

  const payout = calculatePayout(validBets, winningNumber);

  response.status(200).json({ bets: validBets, winningNumber, payout });
};
