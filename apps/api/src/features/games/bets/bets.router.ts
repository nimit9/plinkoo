import { Router } from 'express';
import { getBets } from './bets.controller';

const betsRouter: Router = Router();

betsRouter.get('/', getBets);

export default betsRouter;
