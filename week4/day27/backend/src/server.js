require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(compression());
app.use(morgan("dev"));

app.use(
  express.json({
    limit: "10mb",
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api/", limiter);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    application: "SDA Training Capstone",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "SDA Training Capstone API",
  });
});

app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/ai", require("./routes/ai"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Capstone backend running on http://localhost:${PORT}`);
});