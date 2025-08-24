import { Router } from 'express';
import { validateBet, requireAuth } from '../../../middlewares/bet.middleware';
import { placeBet } from './dice.controller';

const diceRouter: Router = Router();

diceRouter.post(
  '/place-bet',
  requireAuth,
  validateBet({ game: 'dice', minBet: 0.01 }),
  placeBet
);

export default diceRouter;
