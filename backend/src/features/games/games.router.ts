import { Router } from 'express';
import plinkooRouter from './plinkoo/plinkoo.router';
import minesRouter from './mines/mines.router';

const gameRouter = Router();

gameRouter.use('/plinkoo', plinkooRouter);
gameRouter.use('/mines', minesRouter);

export default gameRouter;
