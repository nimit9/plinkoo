import { Router } from 'express';
import plinkooRouter from './plinkoo/plinkoo.router';
import minesRouter from './mines/mines.router';
import limboRouter from './limbo/limbo.router';

const gameRouter = Router();

gameRouter.use('/plinkoo', plinkooRouter);
gameRouter.use('/mines', minesRouter);
gameRouter.use('/limbo', limboRouter);

export default gameRouter;
