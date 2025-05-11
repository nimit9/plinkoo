import { Router } from 'express';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import { getActiveGame, placeBet } from './blackjack.controller';

const blackjackRouter: Router = Router();

blackjackRouter.post('/bet', isAuthenticated, placeBet);
// blackjackRouter.post(
//   '/next',
//   // isAuthenticated,
//   playRound
// );
blackjackRouter.get('/active', isAuthenticated, getActiveGame);

export default blackjackRouter;
