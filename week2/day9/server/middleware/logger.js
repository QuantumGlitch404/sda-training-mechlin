const winston = require("winston");

const logger =
  winston.createLogger({
    level: "info",

    format:
      winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({
          stack: true
        }),
        winston.format.json()
      ),

    defaultMeta: {
      service: "express-app"
    },

    transports: [
      new winston.transports.Console({
        format:
          winston.format.simple()
      }),

      new winston.transports.File({
        filename:
          "logs/error.log",
        level: "error"
      }),

      new winston.transports.File({
        filename:
          "logs/combined.log"
      })
    ]
  });

const loggerMiddleware = (
  req,
  res,
  next
) => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });

  next();
};

module.exports = {
  logger,
  loggerMiddleware
};