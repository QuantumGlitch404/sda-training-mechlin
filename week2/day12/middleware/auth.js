const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { AppError } = require("./errorHandler");
const User = require("../models/User");

class AuthService {
  constructor() {
    this.jwtSecret =
      process.env.JWT_SECRET || "day12-training-secret";

    this.jwtExpiresIn =
      process.env.JWT_EXPIRES_IN || "7d";

    this.refreshTokenExpiresIn =
      process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";
  }

  async generateTokens(user) {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(
      payload,
      this.jwtSecret,
      {
        expiresIn: this.jwtExpiresIn,
        issuer: "sda-training-api",
        audience: "sda-training-client"
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id.toString(),
        type: "refresh"
      },
      this.jwtSecret,
      {
        expiresIn: this.refreshTokenExpiresIn
      }
    );

    return {
      accessToken,
      refreshToken
    };
  }

  async verifyToken(token) {
    try {
      return jwt.verify(
        token,
        this.jwtSecret,
        {
          issuer: "sda-training-api",
          audience: "sda-training-client"
        }
      );
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError(
          "Token expired",
          401,
          "TOKEN_EXPIRED"
        );
      }

      if (error.name === "JsonWebTokenError") {
        throw new AppError(
          "Invalid token",
          401,
          "INVALID_TOKEN"
        );
      }

      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        this.jwtSecret
      );

      if (decoded.type !== "refresh") {
        throw new AppError(
          "Invalid refresh token",
          401,
          "INVALID_REFRESH_TOKEN"
        );
      }

      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new AppError(
          "User not found or inactive",
          401,
          "USER_NOT_FOUND"
        );
      }

      return await this.generateTokens(user);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "Invalid refresh token",
        401,
        "INVALID_REFRESH_TOKEN"
      );
    }
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(
      password,
      hashedPassword
    );
  }

  async validatePassword(password) {
    if (typeof password !== "string") {
      throw new AppError(
        "Password is required",
        400,
        "INVALID_PASSWORD"
      );
    }

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar =
      /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];

    if (password.length < minLength) {
      errors.push(
        "Password must be at least 8 characters long"
      );
    }

    if (!hasUpperCase) {
      errors.push(
        "Password must contain at least one uppercase letter"
      );
    }

    if (!hasLowerCase) {
      errors.push(
        "Password must contain at least one lowercase letter"
      );
    }

    if (!hasNumbers) {
      errors.push(
        "Password must contain at least one number"
      );
    }

    if (!hasSpecialChar) {
      errors.push(
        "Password must contain at least one special character"
      );
    }

    if (errors.length > 0) {
      throw new AppError(
        "Password validation failed",
        400,
        "PASSWORD_VALIDATION_FAILED",
        errors
      );
    }

    return true;
  }
}

const authService = new AuthService();

const authenticate = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new AppError(
        "Access token is required",
        401,
        "TOKEN_REQUIRED"
      );
    }

    const token = authHeader.substring(7);

    const decoded =
      await authService.verifyToken(token);

    const user =
      await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new AppError(
        "User not found or inactive",
        401,
        "USER_NOT_FOUND"
      );
    }

    req.user = user;
    req.auth = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required",
          401,
          "AUTHENTICATION_REQUIRED"
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Insufficient permissions",
          403,
          "INSUFFICIENT_PERMISSIONS"
        )
      );
    }

    next();
  };
};

const optionalAuth = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      const token = authHeader.substring(7);

      const decoded =
        await authService.verifyToken(token);

      const user =
        await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
        req.auth = decoded;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authService,
  authenticate,
  authorize,
  optionalAuth
};