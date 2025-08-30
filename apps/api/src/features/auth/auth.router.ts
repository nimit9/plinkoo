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
router.get('/google', (req, res, next) => {
  const state = JSON.stringify({ redirect: req.query.redirect_to });
  // Store the redirect URL in session if provided
  (
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: encodeURIComponent(state),
    }) as RequestHandler
  )(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }) as RequestHandler,
  (req, res) => {
    const state = req.query.state
      ? (JSON.parse(decodeURIComponent(req.query.state as string)) as {
          redirect?: string;
        })
      : {};
    res.redirect(state.redirect || `${process.env.CLIENT_URL}`);
  }
);

// Local authentication routes
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }) as RequestHandler,
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}`);
  }
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

  req.login(user, err => {
    if (err) throw new BadRequestError('Error logging in');
    res.redirect(`${process.env.CLIENT_URL}`);
  });
});

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) next(err);
    res.json({ message: 'Logged out successfully' });
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
