import { Router } from 'express';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import { placeBetAndSpin } from './roulette.controller';
import { validateBet } from '../../../middlewares/bet.middleware';
import { validateRouletteBet } from './roulette.middleware';

const rouletteRouter: Router = Router();

rouletteRouter.post(
  '/place-bet',
  isAuthenticated,
  validateRouletteBet,
  validateBet,
  placeBetAndSpin
);

export default rouletteRouter;
