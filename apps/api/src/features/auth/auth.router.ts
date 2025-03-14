import passport from 'passport';
import { hash } from 'bcrypt';
import db from '@repo/db';
import type { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '@repo/common/types';
import { Router } from 'express';
import type { RequestHandler } from 'express';
import { BadRequestError } from '../../errors';
import { isAuthenticated } from '../../middlewares/auth.middleware';

interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

const router: Router = Router();

// Google authentication routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }) as RequestHandler,
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }) as RequestHandler,
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}`);
  },
);

// Local authentication routes
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }) as RequestHandler,
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}`);
  },
);

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body as RegisterRequestBody;

  const hashedPassword = await hash(password, 10);
  const user = await db.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name,
    },
    create: {
      email,
      password: hashedPassword,
      name,
    },
  });

  req.login(user, (err) => {
    if (err) throw new BadRequestError('Error logging in');
    res.redirect(`${process.env.CLIENT_URL}`);
  });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) next(err);
    res.redirect('/auth');
  });
});

router.get('/me', isAuthenticated, (req, res) => {
  const user = req.user as User;
  if (user.password) {
    const { password: _password, ...userWithoutPassword } = user;
    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, userWithoutPassword));
  }
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, user));
});

export default router;
