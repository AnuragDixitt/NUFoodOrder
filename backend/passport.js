const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const Users = require('./models/Users');

const GOOGLE_CLIENT_ID="374144058929-n1r07srrr9tvlghch46sdl6gqus8tevl.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET="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"

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id} , function (err, user) {
        if (err) { return done(err); }
        if (user) {
            return done(null, user);
        } else {
            const newUser = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName
            });
            newUser.save(function(err) {
                if (err) { return done(err);}
                return done(null, newUser)
            });
        }
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
})
passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user){
        done(err, user);    
    });
});