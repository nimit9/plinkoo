import { z } from 'zod';
import { placeBetSchema } from './schema';

export type DiceCondition = 'above' | 'below';

export type DicePlaceBetRequestBody = z.infer<typeof placeBetSchema>;

export interface DicePlaceBetResponseState {
  target: number;
  condition: DiceCondition;
  result: number;
}

export interface DicePlaceBetResponse {
  id: string;
  state: DicePlaceBetResponseState;
  payoutMultiplier: number;
  payout: number;
  balance: number;
}
