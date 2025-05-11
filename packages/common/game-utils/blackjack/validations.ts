import { z } from 'zod';

export const BlackjackBetSchema = z.object({
  betAmount: z.number().min(0.01, 'Bet amount must be at least 0.01'),
});
