const express = require("express");

const router = express.Router();

const passport =
  require("../middleware/oauth");

const {
  authService,
  authenticate
} = require("../middleware/auth");

const {
  requirePermission
} = require("../middleware/rbac");

const User =
  require("../models/User");

const {
  AppError
} = require("../middleware/errorHandler");

router.post(
  "/register",
  async (req, res, next) => {
    try {
      const {
        name,
        email,
        password
      } = req.body;

      if (!name || !email || !password) {
        throw new AppError(
          "Name, email and password are required",
          400,
          "REQUIRED_FIELDS"
        );
      }

      await authService.validatePassword(
        password
      );

      const existingUser =
        await User.findOne({
          email
        });

      if (existingUser) {
        throw new AppError(
          "User already exists",
          400,
          "USER_EXISTS"
        );
      }

      const user = new User({
  name,
  email,
  password,
  role: "user"
});

      await user.save();

      const tokens =
        await authService.generateTokens(
          user
        );

      res.status(201).json({
        success: true,
        message:
          "User registered successfully",

        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },

          ...tokens
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req, res, next) => {
    try {
      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({
          email,
          isActive: true
        }).select("+password");

      if (!user) {
        throw new AppError(
          "Invalid credentials",
          401,
          "INVALID_CREDENTIALS"
        );
      }

      const isValid =
        await authService.comparePassword(
          password,
          user.password
        );

      if (!isValid) {
        throw new AppError(
          "Invalid credentials",
          401,
          "INVALID_CREDENTIALS"
        );
      }

      user.lastLogin = new Date();

      await user.save();

      const tokens =
        await authService.generateTokens(
          user
        );

      res.json({
        success: true,
        message: "Login successful",

        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },

          ...tokens
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/refresh",
  async (req, res, next) => {
    try {
      const {
        refreshToken
      } = req.body;

      if (!refreshToken) {
        throw new AppError(
          "Refresh token is required",
          400,
          "REFRESH_TOKEN_REQUIRED"
        );
      }

      const tokens =
        await authService.refreshToken(
          refreshToken
        );

      res.json({
        success: true,
        message:
          "Token refreshed successfully",
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/logout",
  authenticate,
  async (req, res, next) => {
    try {
      res.json({
        success: true,
        message:
          "Logged out successfully"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/me",
  authenticate,
  async (req, res, next) => {
    try {
      res.json({
        success: true,
        data: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          isActive:
            req.user.isActive,
          lastLogin:
            req.user.lastLogin,
          createdAt:
            req.user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/admin-area",
  authenticate,
  requirePermission(
    "users:write"
  ),
  (req, res) => {
    res.json({
      success: true,
      message:
        "Admin permission verified",
      user: {
        email: req.user.email,
        role: req.user.role
      }
    });
  }
);

router.get(
  "/google",
  (req, res, next) => {
    if (
      !process.env.GOOGLE_CLIENT_ID
    ) {
      return next(
        new AppError(
          "Google OAuth is not configured",
          503,
          "OAUTH_NOT_CONFIGURED"
        )
      );
    }

    passport.authenticate(
      "google",
      {
        scope: [
          "profile",
          "email"
        ]
      }
    )(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate(
    "google",
    {
      session: false
    }
  ),
  async (req, res, next) => {
    try {
      const tokens =
        await authService.generateTokens(
          req.user
        );

      res.json({
        success: true,
        message:
          "Google authentication successful",
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/facebook",
  (req, res, next) => {
    if (
      !process.env.FACEBOOK_APP_ID
    ) {
      return next(
        new AppError(
          "Facebook OAuth is not configured",
          503,
          "OAUTH_NOT_CONFIGURED"
        )
      );
    }

    passport.authenticate(
      "facebook",
      {
        scope: ["email"]
      }
    )(req, res, next);
  }
);

router.get(
  "/github",
  (req, res, next) => {
    if (
      !process.env.GITHUB_CLIENT_ID
    ) {
      return next(
        new AppError(
          "GitHub OAuth is not configured",
          503,
          "OAUTH_NOT_CONFIGURED"
        )
      );
    }

    passport.authenticate(
      "github",
      {
        scope: [
          "user:email"
        ]
      }
    )(req, res, next);
  }
);

router.put(
  "/change-password",
  authenticate,
  async (req, res, next) => {
    try {
      const {
        currentPassword,
        newPassword
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        ).select("+password");

      const valid =
        await authService.comparePassword(
          currentPassword,
          user.password
        );

      if (!valid) {
        throw new AppError(
          "Current password is incorrect",
          400,
          "INVALID_CURRENT_PASSWORD"
        );
      }

      await authService.validatePassword(
        newPassword
      );

      user.password =
        await authService.hashPassword(
          newPassword
        );

      await user.save();

      res.json({
        success: true,
        message:
          "Password changed successfully"
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;