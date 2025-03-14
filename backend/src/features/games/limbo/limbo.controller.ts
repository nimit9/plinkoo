import { Request, Response } from 'express';
import { getResult } from './limbo.service';

export const placeBet = (req: Request, res: Response) => {
  const { clientSeed } = req.body;

  const result = getResult(clientSeed);

  res.status(200).json({ result });
};
