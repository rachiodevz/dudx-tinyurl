import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config/index.js";

let userDb = null;

export function setupAuth(userDatabase) {
  userDb = userDatabase;

  passport.serializeUser((user, done) => {
    // Serialize only the Google ID
    done(null, user.googleId);
  });

  passport.deserializeUser(async (googleId, done) => {
    try {
      // Fetch fresh user data from database
      const user = await userDb.getUserByGoogleId(googleId);
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: "/auth/google/callback", // Use relative URL for dynamic host resolution
        proxy: true, // Trust proxy headers (important for production)
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userDb.findOrCreateUser(profile);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}

export function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
}

export default { setupAuth, requireAuth };
