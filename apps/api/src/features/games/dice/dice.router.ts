import { Router } from 'express';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import { placeBet } from './dice.controller';

const diceRouter: Router = Router();

diceRouter.post('/place-bet', isAuthenticated, placeBet);

export default diceRouter;
