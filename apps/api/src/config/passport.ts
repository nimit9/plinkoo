import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';
import db from '@repo/db';
import type { User } from '@prisma/client';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (_, __, profile, done) => {
      const profileInfo = {
        googleId: profile.id,
        name: profile.displayName,
        picture: profile.photos?.[0].value || null,
      };

      try {
        const user = db.user.upsert({
          where: {
            email: profile.emails?.[0].value || '',
          },
          create: {
            ...profileInfo,
            email: profile.emails?.[0].value || '',
            emailVerified: true, // Google OAuth users are pre-verified
          },
          update: {
            ...profileInfo,
            emailVerified: true, // Ensure Google OAuth users are marked as verified
          },
        });

        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !(await compare(password, user.password || ''))) {
          done(null, false, { message: 'Invalid email or password' });
          return;
        }

        // Check if email is verified
        if (!user.emailVerified) {
          done(null, false, {
            message: 'Please verify your email before logging in',
          });
          return;
        }

        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
