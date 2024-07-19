import { Request, Response } from 'express';
import { getResult } from './keno.service';

export const placeBet = (req: Request, res: Response) => {
  const { clientSeed, selectedTiles, risk } = req.body;

  const result = getResult(clientSeed, selectedTiles, risk);

  res.status(200).json({ result });
};
