import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from '@repo/db';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (_, __, profile, done) => {
      const profileInfo = {
        googleId: profile.id,
        name: profile.displayName,
        picture: profile.photos?.[0].value || null,
      };

      try {
        // Find the user by email
        let user = await db.user.findFirst({
          where: { email: profile.emails?.[0].value || '' },
        });
        if (!user) {
          user = await db.user.create({
            data: {
              ...profileInfo,
              email: profile.emails?.[0].value || '',
            },
          });
        } else {
          user = await db.user.update({
            where: { id: user.id },
            data: profileInfo,
          });
        }

        return done(null, user);
      } catch (err) {
        console.log('error', err);

        return done(err, undefined);
      }
    },
  ),
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

        if (!user || !(await bcrypt.compare(password, user.password || ''))) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
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
