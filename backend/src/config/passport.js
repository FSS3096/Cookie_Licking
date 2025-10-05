const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');

// Only configure GitHub strategy if credentials are available
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email']
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        // Check if user already exists
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // If user doesn't exist, create a new one
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          
          // Check if email is already registered
          if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              // Link GitHub to existing account
              existingUser.githubId = profile.id;
              existingUser.githubUsername = profile.username;
              if (!existingUser.name) {
                existingUser.name = profile.displayName;
              }
              if (!existingUser.profilePicture) {
                existingUser.profilePicture = profile.photos[0]?.value;
              }
              user = await existingUser.save();
            }
          }

          if (!user) {
            // Create new user
            user = await User.create({
              githubId: profile.id,
              githubUsername: profile.username,
              email: email,
              name: profile.displayName,
              profilePicture: profile.photos[0]?.value
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  ));
} else {
  console.warn('GitHub OAuth not configured: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing. Skipping GitHub strategy setup.');
}

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;