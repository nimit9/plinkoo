import { Router } from 'express';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import {
  cashOut,
  getActiveGame,
  playRound,
  startGame,
} from './mines.controller';
import { requireAuth, validateBet } from '../../../middlewares/bet.middleware';
import { validatePlayRoundRequest } from './mines.middleware';

const minesRouter: Router = Router();

minesRouter.post('/start', requireAuth, validateBet, startGame);
minesRouter.post(
  '/play-round',
  requireAuth,
  validatePlayRoundRequest,
  playRound
);
minesRouter.post('/cash-out', requireAuth, cashOut);
minesRouter.get('/active', requireAuth, getActiveGame);

export default minesRouter;
