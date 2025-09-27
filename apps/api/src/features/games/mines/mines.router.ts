import { Router } from 'express';
import { requireEmailVerification } from '../../../middlewares/auth.middleware';
import {
  cashOut,
  getActiveGame,
  playRound,
  startGame,
} from './mines.controller';
import { validateBet } from '../../../middlewares/bet.middleware';
import { validatePlayRoundRequest } from './mines.middleware';
import { rateLimitBets } from '../../../middlewares/rateLimit.middleware';

const minesRouter: Router = Router();

minesRouter.post(
  '/start',
  requireEmailVerification,
  rateLimitBets({ maxBetsPerMinute: 30 }),
  validateBet,
  startGame
);
minesRouter.post(
  '/play-round',
  requireEmailVerification,
  validatePlayRoundRequest,
  playRound
);
minesRouter.post('/cash-out', requireEmailVerification, cashOut);
minesRouter.get('/active', requireEmailVerification, getActiveGame);

export default minesRouter;
