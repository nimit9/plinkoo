import { Router } from 'express';
import { isAuthenticated } from '../../../middlewares/auth.middleware';
import { placeBet } from './keno.controller';

const kenoRouter: Router = Router();

kenoRouter.post('/place-bet', isAuthenticated, placeBet);

export default kenoRouter;
