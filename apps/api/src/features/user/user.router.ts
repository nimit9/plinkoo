import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import {
  getBalance,
  rotateSeed,
  getProvablyFairState,
} from './user.controller';

const router: Router = Router();

router.get('/balance', isAuthenticated, getBalance);
router.post('/rotate-seeds', isAuthenticated, rotateSeed);
router.get('/provably-fair-state', isAuthenticated, getProvablyFairState);

export default router;
