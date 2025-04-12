import 'express-async-errors';
import 'dotenv/config';

import { json, urlencoded } from 'body-parser';
import express, { type Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import { authRouter, gameRouter, userRouter } from './routes';
import './config/passport';
import notFoundMiddleware from './middlewares/not-found';
import { errorHandlerMiddleware } from './middlewares/error-handler';

export const createServer = (): Express => {
  const app = express();
  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(
      cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Use env variable with fallback
        credentials: true, // Allow cookies and other credentials
      })
    )
    .use(
      session({
        secret: process.env.COOKIE_SECRET || 'secr3T',
        cookie: {
          secure: process.env.NODE_ENV === 'production' ? true : 'auto',
          httpOnly: true,
          maxAge: 2 * 24 * 60 * 60 * 1000,
        },
        resave: false,
        saveUninitialized: false,
      })
    )
    .use(passport.initialize())
    .use(passport.session())
    .get('/health', (_, res) => {
      return res.status(StatusCodes.OK).json({ ok: true });
    })
    .use('/api/v1/auth', authRouter)
    .use('/api/v1/games', gameRouter)
    .use('/api/v1/user', userRouter);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
};
