import { Router } from 'express';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import { placeBet } from './keno.controller';
import { validateBet } from '../../../middlewares/bet.middleware';

const kenoRouter: Router = Router();

kenoRouter.post('/place-bet', isAuthenticated, validateBet, placeBet);

export default kenoRouter;
