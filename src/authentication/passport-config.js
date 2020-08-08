const passport = require("passport");
const User = require("../models/userModel");
const { validatePassword } = require("./passwordUtils");
const LocalStrategy = require("passport-local").Strategy;
// const JWTstrategy = require("passport-jwt").Strategy;
// const ExtractJWT = require("passport-jwt").ExtractJwt;

const customFields = {
  usernameField: "userEmail",
  passwordField: "password",
};

const localStrategy = new LocalStrategy(
  customFields,
  (username, password, done) => {
    User.findOne({ userEmail: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      isValidUser = validatePassword(password, user);

      if (!isValidUser) {
        return done(null, false, { message: "Incorrect password." });
      }
      let tempUser = {
        id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
      };
      return done(null, tempUser);
    });
  }
);

// const opts = {};

// opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = "jwt-secret";

// const jwtStrategy = new JWTStrategy(opts, (jwt_payload, done) => {
//   User.findById(jwt_payload.id)
//     .then((user) => {
//       if (user) {
//         return done(null, user);
//       }
//       return done(null, false);
//     })
//     .catch((err) => console.error(err));
// });

passport.use(localStrategy);
// passport.use('jwt', jwtStrategy);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
