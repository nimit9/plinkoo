import { Router } from 'express';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import {
  cashOut,
  getActiveGame,
  playRound,
  startGame,
} from './mines.controller';

const minesRouter: Router = Router();

minesRouter.post('/start', isAuthenticated, startGame);
minesRouter.post('/play-round', isAuthenticated, playRound);
minesRouter.post('/cash-out', isAuthenticated, cashOut);
minesRouter.get('/active', isAuthenticated, getActiveGame);

export default minesRouter;
