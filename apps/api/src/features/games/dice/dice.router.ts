import { Router } from 'express';
import {
  validateBet,
  requireAuth,
  validateGameConstraints,
} from '../../../middlewares/bet.middleware';
import { placeBet } from './dice.controller';

const diceRouter: Router = Router();

diceRouter.post(
  '/place-bet',
  requireAuth,
  validateBet,
  validateGameConstraints({ minBetAmount: 0.01 }),
  placeBet
);

export default diceRouter;
