import { z } from 'zod';
import { MinesBetSchema } from './validations';

export type MinesBet = z.infer<typeof MinesBetSchema>;

export type MinesRound = {
  selectedTileIndex: number;
  payoutMultiplier: number;
};

export type MinesRevealedState = {
  mines: number[];
  minesCount: number;
  rounds: MinesRound[];
};

export type MinesHiddenState = {
  mines: null;
  minesCount: number;
  rounds: MinesRound[];
};

export type MinesPlayRoundResponse = {
  id: string;
  state: MinesHiddenState;
  active: boolean;
  betAmount: number;
};

export type MinesGameOverResponse = {
  id: string;
  state: MinesRevealedState;
  payoutMultiplier: number;
  payout: number;
  balance: number;
  active: boolean;
};
