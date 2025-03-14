import { Router } from 'express';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import { placeBetAndSpin } from './roulette.controller';

const rouletteRouter: Router = Router();

rouletteRouter.post('/place-bet', isAuthenticated, placeBetAndSpin);

export default rouletteRouter;
