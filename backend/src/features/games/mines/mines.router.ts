import { Router } from 'express';
import { cashOut, playRound, startGame } from './mines.controller';

const minesRouter = Router();

minesRouter.post('/start', startGame);
minesRouter.post('/play-round', playRound);
minesRouter.post('/cash-out', cashOut);

export default minesRouter;
