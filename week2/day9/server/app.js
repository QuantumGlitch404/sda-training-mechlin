require("dotenv").config();

const express =
  require("express");

const cors =
  require("cors");

const helmet =
  require("helmet");

const compression =
  require("compression");

const rateLimit =
  require(
    "express-rate-limit"
  );

const morgan =
  require("morgan");

const {
  logger,
  loggerMiddleware
} = require(
  "./middleware/logger"
);

const {
  performanceMiddleware,
  performanceMonitor
} = require(
  "./middleware/performance"
);

const {
  errorHandler
} = require(
  "./middleware/errorHandler"
);

const userRoutes =
  require(
    "./routes/userRoutes"
  );

const productRoutes =
  require(
    "./routes/productRoutes"
  );

const orderRoutes =
  require(
    "./routes/orderRoutes"
  );

const userService =
  require(
    "./services/userService"
  );

const productService =
  require(
    "./services/productService"
  );

const orderService =
  require(
    "./services/orderService"
  );

class ExpressApp {
  constructor() {
    this.app =
      express();

    this.port =
      process.env.PORT ||
      3001;

    this.setupMiddleware();

    this.setupRoutes();

    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
              "'self'",
              "'unsafe-inline'"
            ],
            scriptSrc: [
              "'self'"
            ],
            imgSrc: [
              "'self'",
              "data:",
              "https:"
            ]
          }
        }
      })
    );

    this.app.use(
      cors({
        origin:
          process.env.FRONTEND_URL ||
          "http://localhost:5173",

        credentials:
          true,

        methods: [
          "GET",
          "POST",
          "PUT",
          "DELETE",
          "PATCH"
        ],

        allowedHeaders: [
          "Content-Type",
          "Authorization"
        ]
      })
    );

    this.app.use(
      compression()
    );

    const limiter =
      rateLimit({
        windowMs:
          15 * 60 * 1000,

        max: 100,

        message: {
          error:
            "Too many requests, please try again later."
        },

        standardHeaders:
          true,

        legacyHeaders:
          false
      });

    this.app.use(
      "/api/",
      limiter
    );

    this.app.use(
      morgan("combined")
    );

    this.app.use(
      loggerMiddleware
    );

    this.app.use(
      performanceMiddleware
    );

    this.app.use(
      express.json({
        limit: "10mb"
      })
    );

    this.app.use(
      express.urlencoded({
        extended: true,
        limit: "10mb"
      })
    );
  }

  setupRoutes() {
    this.app.get(
      "/health",
      (req, res) => {
        res.json({
          status: "OK",
          timestamp:
            new Date()
              .toISOString(),
          uptime:
            process.uptime(),

          memory:
            process.memoryUsage(),

          version:
            process.version
        });
      }
    );

    this.app.get(
      "/api/performance",
      (req, res) => {
        res.json({
          success: true,
          data:
            performanceMonitor
              .getMetrics()
        });
      }
    );

    this.app.use(
      "/api/users",
      userRoutes
    );

    this.app.use(
      "/api/products",
      productRoutes
    );

    this.app.use(
      "/api/orders",
      orderRoutes
    );

    this.app.use(
      (req, res) => {
        res.status(404).json({
          success: false,
          message:
            "Route not found",
          path:
            req.originalUrl
        });
      }
    );
  }

  setupErrorHandling() {
    this.app.use(
      errorHandler
    );
  }

  async initializeServices() {
    await userService
      .initialize();

    await productService
      .initialize();

    await orderService
      .initialize();

    logger.info(
      "All services initialized successfully"
    );
  }

  async start() {
    await this.initializeServices();

    this.app.listen(
      this.port,
      () => {
        logger.info(
          `Server running on port ${this.port}`
        );

        logger.info(
          `Environment: ${
            process.env.NODE_ENV ||
            "development"
          }`
        );

        logger.info(
          `Node version: ${process.version}`
        );
      }
    );
  }
}

const app =
  new ExpressApp();

app.start().catch(
  (error) => {
    console.error(
      "Application startup failed:",
      error
    );

    process.exit(1);
  }
);