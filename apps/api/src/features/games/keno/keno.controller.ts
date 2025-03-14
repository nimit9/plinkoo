import type { Request, Response } from 'express';
import { getResult } from './keno.service';
import type { KenoRisk } from './keno.types';

interface KenoRequestBody {
  clientSeed: string;
  selectedTiles: number[];
  risk: KenoRisk;
}

export const placeBet = (req: Request, res: Response) => {
  const { clientSeed, selectedTiles, risk } = req.body as KenoRequestBody;

  const result = getResult(clientSeed, selectedTiles, risk);

  res.status(200).json({ result });
};
