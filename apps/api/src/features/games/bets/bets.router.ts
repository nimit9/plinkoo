import { Router } from 'express';
import { getBet, getBets } from './bets.controller';

const betsRouter: Router = Router();

betsRouter.get('/', getBets);
betsRouter.get('/:betId', getBet);

export default betsRouter;
