import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const configurePassport = () => {
  if (process.env.GOOGLE_CLIENT_ID) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id }).select('+password');

            if (!user) {
              // Check if user exists with the same email but no googleId
              user = await User.findOne({ email: profile.emails[0].value }).select('+password');

              if (user) {
                // Update existing user with googleId
                user.googleId = profile.id;
                if (!user.profilePicture) {
                  user.profilePicture = profile.photos[0].value;
                }
                await user.save();
              } else {
                // Create new user
                const phone = profile.phoneNumbers && profile.phoneNumbers.length > 0 
                  ? profile.phoneNumbers[0].value 
                  : undefined;

                user = await User.create({
                  googleId: profile.id,
                  name: profile.displayName,
                  email: profile.emails[0].value,
                  phone: phone,
                  profilePicture: profile.photos[0].value,
                  isVerified: true, // Google emails are already verified
                  role: 'student',
                });
              }
            }

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
  } else {
    console.warn("⚠️ Google OAuth credentials missing. Google Login will be disabled.");
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;
