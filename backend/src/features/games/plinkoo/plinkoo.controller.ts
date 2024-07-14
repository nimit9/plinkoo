import { Request, Response } from 'express';
import { calculateOutcome } from './plinkoo.service';

export const getOutcome = (req: Request, res: Response) => {
  const { clientSeed = 'P7xjSv-1ff' } = req.body; // TODO: remove default seed
  const result = calculateOutcome(clientSeed);
  res.send(result);
};
