const {
  logger
} = require("./logger");

class AppError extends Error {
  constructor(
    message,
    statusCode,
    details = null
  ) {
    super(message);

    this.statusCode =
      statusCode;

    this.isOperational =
      true;

    this.details =
      details;

    Error.captureStackTrace(
      this,
      this.constructor
    );
  }
}

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  logger.error({
    error:
      err.message,
    stack:
      err.stack,
    url:
      req.originalUrl,
    method:
      req.method,
    ip:
      req.ip,
    userId:
      req.user?.userId
  });

  let error =
    err;

  if (
    err.name ===
    "JsonWebTokenError"
  ) {
    error =
      new AppError(
        "Invalid token",
        401
      );
  }

  if (
    err.name ===
    "TokenExpiredError"
  ) {
    error =
      new AppError(
        "Token expired",
        401
      );
  }

  if (
    err.status === 429
  ) {
    error =
      new AppError(
        "Too many requests, please try again later",
        429
      );
  }

  res.status(
    error.statusCode ||
      500
  ).json({
    success: false,

    error: {
      message:
        error.message ||
        "Server Error",

      ...(error.details && {
        details:
          error.details
      }),

      ...(process.env.NODE_ENV ===
        "development" && {
        stack:
          error.stack
      })
    }
  });
};

module.exports = {
  errorHandler,
  AppError
};