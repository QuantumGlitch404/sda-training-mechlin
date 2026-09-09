const passport = require("passport");

const GoogleStrategy =
  require("passport-google-oauth20").Strategy;

const FacebookStrategy =
  require("passport-facebook").Strategy;

const GitHubStrategy =
  require("passport-github2").Strategy;

const User = require("../models/User");

const setupGoogle = () => {
  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET
  ) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID:
          process.env.GOOGLE_CLIENT_ID,

        clientSecret:
          process.env.GOOGLE_CLIENT_SECRET,

        callbackURL:
          "/api/v1/auth/google/callback"
      },

      async (
        accessToken,
        refreshToken,
        profile,
        done
      ) => {
        try {
          const email =
            profile.emails?.[0]?.value;

          if (!email) {
            return done(
              new Error(
                "Google account email not available"
              )
            );
          }

          let user =
            await User.findOne({
              email
            });

          if (!user) {
            user = new User({
              name:
                profile.displayName ||
                "Google User",

              email,
              password:
                `OAuthGoogle-${Date.now()}-${Math.random()}`,

              isActive: true,
              role: "user"
            });

            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

const setupFacebook = () => {
  if (
    !process.env.FACEBOOK_APP_ID ||
    !process.env.FACEBOOK_APP_SECRET
  ) {
    return;
  }

  passport.use(
    new FacebookStrategy(
      {
        clientID:
          process.env.FACEBOOK_APP_ID,

        clientSecret:
          process.env.FACEBOOK_APP_SECRET,

        callbackURL:
          "/api/v1/auth/facebook/callback",

        profileFields: [
          "id",
          "emails",
          "name",
          "picture"
        ]
      },

      async (
        accessToken,
        refreshToken,
        profile,
        done
      ) => {
        try {
          const email =
            profile.emails?.[0]?.value;

          if (!email) {
            return done(
              new Error(
                "Facebook account email not available"
              )
            );
          }

          let user =
            await User.findOne({
              email
            });

          if (!user) {
            user = new User({
              name: `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim(),

              email,

              password:
                `OAuthFacebook-${Date.now()}-${Math.random()}`,

              isActive: true,
              role: "user"
            });

            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

const setupGitHub = () => {
  if (
    !process.env.GITHUB_CLIENT_ID ||
    !process.env.GITHUB_CLIENT_SECRET
  ) {
    return;
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID:
          process.env.GITHUB_CLIENT_ID,

        clientSecret:
          process.env.GITHUB_CLIENT_SECRET,

        callbackURL:
          "/api/v1/auth/github/callback"
      },

      async (
        accessToken,
        refreshToken,
        profile,
        done
      ) => {
        try {
          const email =
            profile.emails?.[0]?.value;

          if (!email) {
            return done(
              new Error(
                "GitHub account email not available"
              )
            );
          }

          let user =
            await User.findOne({
              email
            });

          if (!user) {
            user = new User({
              name:
                profile.displayName ||
                profile.username ||
                "GitHub User",

              email,

              password:
                `OAuthGitHub-${Date.now()}-${Math.random()}`,

              isActive: true,
              role: "user"
            });

            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

setupGoogle();
setupFacebook();
setupGitHub();

module.exports = passport;