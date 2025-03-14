import type { Request, Response } from 'express';
import type { User } from '@prisma/client';
import type { DiceCondition } from '@repo/common/game-utils/dice/types.js';
import { getResult } from './dice.service';

interface DiceRequestBody {
  target: number;
  condition: DiceCondition;
}

export const placeBet = async (req: Request, res: Response) => {
  const { target, condition } = req.body as DiceRequestBody;
  const user = req.user as User;

  const result = await getResult({ userId: user.id, target, condition });

  res.status(200).json(result);
};
