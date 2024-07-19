import { Router } from 'express';
import { placeBet } from './dice.controller';

const diceRouter = Router();

diceRouter.post('/place-bet', placeBet);

export default diceRouter;
