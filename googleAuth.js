import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

/*
================================
Google OAuth Strategy
================================
*/

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: "http://localhost:5000/auth/google/callback"
    },

    async (accessToken, refreshToken, profile, done) => {

      try {

        console.log("Google Profile:", profile.id);

        // Check if user exists
        let user = await User.findOne({
          googleId: profile.id
        });

        // If not exists → create new user
        if (!user) {

          user = await User.create({

            googleId: profile.id,

            name: profile.displayName,

            email: profile.emails[0].value

          });

          console.log("New Google user created");

        }
        else {

          console.log("Existing Google user");

        }

        return done(null, user);

      }
      catch (err) {

        console.log("Google Auth Error:", err);

        return done(err, null);

      }

    }
  )
);

/*
================================
Export passport
================================
*/

export default passport;
