import { RouletteBet } from './validations';

enum RouletteBetTypes {
  STRAIGHT = 'straight',
  SPLIT = 'split',
  SIX_LINE = 'sixline',
  CORNER = 'corner',
  STREET = 'street',
  ODD = 'odd',
  EVEN = 'even',
  HIGH = 'high',
  LOW = 'low',
  BLACK = 'black',
  RED = 'red',
  COLUMN = 'column',
  DOZEN = 'dozen',
}

export interface RouletterPlaceBetState {
  bets: RouletteBet[];
  winningNumber: string;
}

export interface RoulettePlaceBetResponse {
  id: string;
  state: RouletterPlaceBetState;
  payoutMultiplier: number;
  payout: number;
  balance: number;
}

export { RouletteBetTypes };
