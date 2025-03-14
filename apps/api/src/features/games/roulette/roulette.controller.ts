import type { Request, Response } from 'express';
import {
  BetsSchema,
  type RouletteBet,
  validateBets,
} from '@repo/common/game-utils/roulette/index.ts';
import { type User } from '@prisma/client';
import { BadRequestError } from '../../../errors';
import { calculatePayout, spinWheel } from './roulette.service';
import { log } from 'console';

export const placeBetAndSpin = async (
  request: Request,
  response: Response,
): Promise<void> => {
  log(request.body);
  const validationResult = BetsSchema.safeParse(request.body);
  console.log('validationResult', validationResult);

  if (!validationResult.success) {
    throw new BadRequestError('Invalid request for bets');
  }

  const { bets } = validationResult.data as { bets: RouletteBet[] };
  log(bets);
  const validBets = validateBets(bets);

  if (validBets.length === 0) {
    throw new BadRequestError('No valid bets placed');
  }

  const user = request.user as User;

  const winningNumber = await spinWheel(user.id);

  const payout = calculatePayout(validBets, winningNumber);

  response.status(200).json({ bets: validBets, winningNumber, payout });
};
