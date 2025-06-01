import { Router } from 'express';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import { blackjackNext, getActiveGame, placeBet } from './blackjack.controller';

const blackjackRouter: Router = Router();

blackjackRouter.post('/bet', isAuthenticated, placeBet);
blackjackRouter.post('/next', isAuthenticated, blackjackNext);
blackjackRouter.get('/active', isAuthenticated, getActiveGame);

export default blackjackRouter;
