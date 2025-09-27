import { Router } from 'express';
import { requireEmailVerification } from '../../../middlewares/auth.middleware';
import { blackjackNext, getActiveGame, placeBet } from './blackjack.controller';
import { rateLimitBets } from '../../../middlewares/rateLimit.middleware';

const blackjackRouter: Router = Router();

blackjackRouter.post(
  '/bet',
  requireEmailVerification,
  rateLimitBets({ maxBetsPerMinute: 30 }),
  placeBet
);
blackjackRouter.post('/next', requireEmailVerification, blackjackNext);
blackjackRouter.get('/active', requireEmailVerification, getActiveGame);

export default blackjackRouter;
