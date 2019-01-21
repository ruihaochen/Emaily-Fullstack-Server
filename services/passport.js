const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  // this id is mongodb "_id", not the googleID
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log('access token', accessToken);
      // console.log('refresh token', refreshToken);
      // console.log('profile:', profile);
      User.findOne({ googleID: profile.id }).then(existingUser => {
        if (existingUser) {
          // we already have a recor with the given profile id
          done(null, existingUser);
        } else {
          // create a new mongoose instance
          new User({ googleID: profile.id })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
