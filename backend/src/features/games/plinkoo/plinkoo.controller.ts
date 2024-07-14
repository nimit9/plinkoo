import { Request, Response } from 'express';
import { calculateOutcome } from './plinkoo.service';

export const getOutcome = (req: Request, res: Response) => {
  const result = calculateOutcome();
  res.send(result);
};
