require("dotenv").config();

const express = require("express");
const compression = require("compression");

const apiRoutes = require("./routes/api/v1");
const {
  apiVersioning
} = require("./middleware/apiVersioning");

const {
  generalLimiter,
  apiKeyLimiter
} = require("./middleware/rateLimiting");

const {
  errorHandler
} = require("./middleware/errorHandler");

const {
  specs,
  swaggerUi
} = require("./docs/swagger");

const {
  cacheService
} = require("./middleware/caching");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

app.use(generalLimiter);
app.use(apiKeyLimiter);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "day11-rest-api"
  });
});

app.use(apiVersioning);

app.use("/api/v1", apiRoutes);

app.use(
  "/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use(errorHandler);

const startServer = async () => {
  try {
    await cacheService.connect();

    app.listen(PORT, () => {
      console.log(
        `Day 11 REST API running on http://localhost:${PORT}`
      );

      console.log(
        `Swagger docs: http://localhost:${PORT}/api/v1/docs`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer
};