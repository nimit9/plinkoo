import { z } from 'zod';
import { MinesBetSchema } from './validations';

export type MinesBet = z.infer<typeof MinesBetSchema>;
