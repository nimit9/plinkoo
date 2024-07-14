import { Router } from 'express';
import { getServerSeeds } from './rng.controller';

const rngRouter = Router();

rngRouter.get('/get-server-seeds', getServerSeeds);

export default rngRouter;
