import { Router } from 'express';
import { requireEmailVerification } from '../../../middlewares/auth.middleware';
import { placeBetAndSpin } from './roulette.controller';
import { validateBet } from '../../../middlewares/bet.middleware';
import { validateRouletteBet } from './roulette.middleware';
import { rateLimitBets } from '../../../middlewares/rateLimit.middleware';

const rouletteRouter: Router = Router();

rouletteRouter.post(
  '/place-bet',
  requireEmailVerification,
  rateLimitBets({ maxBetsPerMinute: 30 }),
  validateRouletteBet,
  validateBet,
  placeBetAndSpin
);

export default rouletteRouter;
