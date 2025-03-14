import { Router } from 'express';
import { getOutcome } from './plinkoo.controller';

const plinkooRouter = Router();

plinkooRouter.post('/outcome', getOutcome);

export default plinkooRouter;
