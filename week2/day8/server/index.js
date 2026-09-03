require("dotenv").config();

const express = require("express");
const cluster = require("cluster");
const path = require("path");
const os = require("os");
const { createServer } = require("http");

const { Server } = require("socket.io");

const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const userService = require("./services/userService");
const productService = require("./services/productService");
const orderService = require("./services/orderService");
const notificationService = require("./services/notificationService");

const {
  errorHandler
} = require("./middleware/errorHandler");

const {
  loggerMiddleware
} = require("./middleware/logger");

const {
  performanceMiddleware,
  performanceMonitor
} = require("./middleware/performance");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const healthRoutes = require("./routes/healthRoutes");

class Application {
  constructor() {
    this.app = express();

    this.server = createServer(this.app);

    this.io = new Server(this.server, {
      cors: {
        origin:
          process.env.FRONTEND_URL ||
          "http://localhost:3000",

        methods: [
          "GET",
          "POST",
          "PATCH",
          "DELETE"
        ]
      }
    });

    this.port = process.env.PORT || 3000;

    this.isProduction =
      process.env.NODE_ENV === "production";
  }

  async initialize() {
    try {
      this.setupMiddleware();

      this.setupRoutes();

      await this.setupServices();

      this.setupWebSocket();

      this.setupErrorHandling();

      this.startServer();
    } catch (error) {
      console.error(
        "Application initialization failed:",
        error
      );

      process.exit(1);
    }
  }

  setupMiddleware() {
    this.app.use(helmet());

    this.app.use(
      cors({
        origin:
          process.env.FRONTEND_URL ||
          "http://localhost:3000",

        credentials: true
      })
    );

    this.app.use(compression());

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message:
        "Too many requests from this IP, please try again later."
    });

    this.app.use("/api/", limiter);

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

    this.app.use(loggerMiddleware);

    this.app.use(performanceMiddleware);

    this.app.use(
      express.static(
        path.join(__dirname, "..")
      )
    );
  }

  setupRoutes() {
    this.app.use(
      "/health",
      healthRoutes
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

    this.app.get(
      "/api/performance",
      (req, res) => {
        res.json({
          success: true,
          metrics:
            performanceMonitor.getMetrics()
        });
      }
    );

    this.app.use(
      (req, res) => {
        res.status(404).json({
          success: false,
          message: "Route not found"
        });
      }
    );
  }

  async setupServices() {
    await userService.initialize();

    await productService.initialize();

    await orderService.initialize();

    await notificationService.initialize();

    console.log(
      "All services initialized successfully"
    );
  }

  setupWebSocket() {
    this.io.on(
      "connection",
      (socket) => {
        console.log(
          "Client connected:",
          socket.id
        );

        socket.on(
          "join",
          (room) => {
            socket.join(room);

            console.log(
              `Client ${socket.id} joined room ${room}`
            );
          }
        );

        socket.on(
          "user:update",
          (data) => {
            socket.broadcast.emit(
              "user:updated",
              data
            );
          }
        );

        socket.on(
          "order:create",
          (data) => {
            socket.broadcast.emit(
              "order:created",
              data
            );
          }
        );

        socket.on(
          "disconnect",
          () => {
            console.log(
              "Client disconnected:",
              socket.id
            );
          }
        );
      }
    );
  }

  setupErrorHandling() {
    this.app.use(errorHandler);

    process.on(
      "unhandledRejection",
      (reason) => {
        console.error(
          "Unhandled Rejection:",
          reason
        );

        process.exit(1);
      }
    );

    process.on(
      "uncaughtException",
      (error) => {
        console.error(
          "Uncaught Exception:",
          error
        );

        process.exit(1);
      }
    );
  }

  startServer() {
    this.server.listen(
      this.port,
      () => {
        console.log(
          `Worker ${process.pid} running on port ${this.port}`
        );

        console.log(
          `Environment: ${
            process.env.NODE_ENV ||
            "development"
          }`
        );

        console.log(
          `Node version: ${process.version}`
        );
      }
    );
  }
}

if (cluster.isPrimary) {
  const numCPUs = Math.min(
    os.cpus().length,
    4
  );

  console.log(
    `Master process ${process.pid} is running`
  );

  console.log(
    `Starting ${numCPUs} workers`
  );

  for (
    let i = 0;
    i < numCPUs;
    i++
  ) {
    cluster.fork();
  }

  cluster.on(
    "exit",
    (worker) => {
      console.log(
        `Worker ${worker.process.pid} died`
      );

      console.log(
        "Starting replacement worker"
      );

      cluster.fork();
    }
  );

  process.on(
    "SIGTERM",
    () => {
      console.log(
        "Master received SIGTERM"
      );

      for (
        const id in cluster.workers
      ) {
        cluster.workers[id].kill();
      }

      process.exit(0);
    }
  );
} else {
  const app = new Application();

  app.initialize();
}