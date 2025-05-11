import type { CardDeck } from 'game-utils/cards/types';

export enum BlackjackActions {
  DEAL = 'deal',
  HIT = 'hit',
  STAND = 'stand',
  DOUBLE = 'double',
  SPLIT = 'split',
  INSURANCE = 'insurance',
  NOINSURANCE = 'noInsurance',
}

export interface BlackjackGameState {
  player: {
    actions: BlackjackActions[];
    value: number;
    cards: CardDeck[];
  };
  dealer: {
    actions: ('deal' | 'hit')[];
    value: number;
    cards: CardDeck[];
  };
}

export interface MinesPlayRoundResponse {
  id: string;
  state: BlackjackGameState;
  active: boolean;
  betAmount: number;
  amountMultiplier: number;
}
