import passport from 'passport';
import { hash } from 'bcrypt';
import db from '@repo/db';
import type { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { Router } from 'express';
import type { RequestHandler } from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import {
  emailService,
  generateVerificationToken,
  getVerificationExpiry,
} from '../../utils/emailService';
import { AuthErrorCode } from '../../types/auth-errors';
import { createErrorResponse, createSuccessResponse } from '../../utils/apiResponse';

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
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err: any, user: User | false, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // Determine specific error code based on the message
      let errorCode = AuthErrorCode.INVALID_CREDENTIALS;
      if (info?.message?.includes('verify your email')) {
        errorCode = AuthErrorCode.EMAIL_NOT_VERIFIED;
      }
      
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createErrorResponse(
            StatusCodes.UNAUTHORIZED,
            {},
            info?.message || 'Authentication failed',
            errorCode
          )
        );
    }

    req.logIn(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }

      const { password: _password, ...userWithoutPassword } = user;
      return res
        .status(StatusCodes.OK)
        .json(
          createSuccessResponse(
            StatusCodes.OK,
            userWithoutPassword,
            'Login successful'
          )
        );
    });
  })(req, res, next);
});

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body as RegisterRequestBody;

  // Check if user already exists
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(StatusCodes.CONFLICT).json(
      createErrorResponse(
        StatusCodes.CONFLICT,
        {},
        'An account with this email already exists',
        AuthErrorCode.USER_ALREADY_EXISTS
      )
    );
  }

  const hashedPassword = await hash(password, 10);
  const verificationToken = generateVerificationToken();
  const verificationExpiry = getVerificationExpiry();

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiry,
    },
  });

  // Send verification email
  try {
    await emailService.sendVerificationEmail(email, verificationToken, name);
  } catch (error) {
    // Delete the user if email sending fails
    await db.user.delete({ where: { id: user.id } });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        {},
        'Failed to send verification email. Please try again.',
        AuthErrorCode.EMAIL_SEND_FAILED
      )
    );
  }

  res
    .status(StatusCodes.CREATED)
    .json(
      createSuccessResponse(
        StatusCodes.CREATED,
        { email: user.email, name: user.name },
        'Registration successful! Please check your email to verify your account.'
      )
    );
});

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) next(err);
    res.json({ message: 'Logged out successfully' });
  });
});

// Email verification routes
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json(
      createErrorResponse(
        StatusCodes.BAD_REQUEST,
        {},
        'Invalid verification link',
        AuthErrorCode.INVALID_VERIFICATION_TOKEN
      )
    );
  }

  const user = await db.user.findUnique({
    where: { emailVerificationToken: token },
  });

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      createErrorResponse(
        StatusCodes.BAD_REQUEST,
        {},
        'Invalid verification link',
        AuthErrorCode.INVALID_VERIFICATION_TOKEN
      )
    );
  }

  if (
    user.emailVerificationExpires &&
    user.emailVerificationExpires < new Date()
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      createErrorResponse(
        StatusCodes.BAD_REQUEST,
        {},
        'This verification link has expired. Please request a new one.',
        AuthErrorCode.EXPIRED_VERIFICATION_TOKEN
      )
    );
  }

  // Update user as verified
  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  // Log the user in automatically after verification
  req.logIn(updatedUser, err => {
    if (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          createErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {},
            'Email verified, but automatic login failed. Please log in manually.',
            AuthErrorCode.AUTO_LOGIN_FAILED
          )
        );
    }
    const { password: _password, ...userWithoutPassword } = updatedUser;
    return res
      .status(StatusCodes.OK)
      .json(
        createSuccessResponse(
          StatusCodes.OK,
          userWithoutPassword,
          'Email verified and logged in successfully!'
        )
      );
  });
});

router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      createErrorResponse(
        StatusCodes.BAD_REQUEST,
        {},
        'Email address is required',
        AuthErrorCode.EMAIL_REQUIRED
      )
    );
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json(
      createErrorResponse(
        StatusCodes.NOT_FOUND,
        {},
        'No account found with this email',
        AuthErrorCode.USER_NOT_FOUND
      )
    );
  }

  if (user.emailVerified) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      createErrorResponse(
        StatusCodes.BAD_REQUEST,
        {},
        'Your email is already verified',
        AuthErrorCode.EMAIL_ALREADY_VERIFIED
      )
    );
  }

  // Generate new verification token
  const verificationToken = generateVerificationToken();
  const verificationExpiry = getVerificationExpiry();

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiry,
    },
  });

  // Send verification email
  try {
    await emailService.sendVerificationEmail(
      email,
      verificationToken,
      user.name || undefined
    );
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        {},
        'Failed to send verification email. Please try again.',
        AuthErrorCode.EMAIL_SEND_FAILED
      )
    );
  }

  res
    .status(StatusCodes.OK)
    .json(
      createSuccessResponse(
        StatusCodes.OK,
        {},
        'Verification email sent successfully!'
      )
    );
});

router.get('/me', isAuthenticated, (req, res) => {
  const user = req.user as User;
  if (user.password) {
    const { password: _password, ...userWithoutPassword } = user;
    return res
      .status(StatusCodes.OK)
      .json(createSuccessResponse(StatusCodes.OK, userWithoutPassword));
  }
  return res.status(StatusCodes.OK).json(createSuccessResponse(StatusCodes.OK, user));
});

export default router;
