import { Request, Response } from 'express';
import { getResult } from './dice.service';

export const placeBet = (req: Request, res: Response) => {
  const { clientSeed, target, condition } = req.body;

  const result = getResult({ clientSeed, target, condition });

  res.status(200).json(result);
};
