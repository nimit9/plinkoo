import type { Request, Response } from 'express';
import { minesManager } from './mines.service';

interface StartGameRequestBody {
  clientSeed: string;
  minesCount: number;
}

interface PlayRoundRequestBody {
  selectedTileIndex: number;
  id: string;
}

interface CashOutRequestBody {
  id: string;
}

export const startGame = (req: Request, res: Response) => {
  const { clientSeed, minesCount } = req.body as StartGameRequestBody;

  const game = minesManager.createGame(minesCount);
  game.startGame(clientSeed);

  res.status(200).json({
    id: game.gameId,
    active: true,
    state: { mines: null, minesCount, rounds: [] },
  });
};

export const playRound = (req: Request, res: Response) => {
  const { selectedTileIndex, id } = req.body as PlayRoundRequestBody;
  const game = minesManager.getGame(id);
  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }
  try {
    const { active, state } = game.playRound(selectedTileIndex);
    if (!active) {
      minesManager.deleteGame(id);
    }
    return res.status(200).json({ active, state, id });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const cashOut = (req: Request, res: Response) => {
  const { id } = req.body as CashOutRequestBody;
  const game = minesManager.getGame(id);
  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }
  try {
    const { active, state } = game.cashOut();
    minesManager.deleteGame(id);
    return res.status(200).json({ active, state, id });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};
