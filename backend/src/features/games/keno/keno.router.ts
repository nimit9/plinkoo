import { Router } from 'express';
import { placeBet } from './keno.controller';

const kenoRouter = Router();

kenoRouter.post('/place-bet', placeBet);

export default kenoRouter;
