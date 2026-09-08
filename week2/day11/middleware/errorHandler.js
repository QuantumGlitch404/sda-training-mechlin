class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details = []) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Internal server error",
      code: err.code || "INTERNAL_ERROR",
      details: err.details || []
    }
  });
};

module.exports = {
  AppError,
  errorHandler
};