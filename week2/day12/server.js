require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const authRoutes =
  require("./routes/authRoutes");

const {
  errorHandler
} = require("./middleware/errorHandler");

const app = express();

const PORT =
  process.env.PORT || 3001;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/sda-training";

app.use(express.json());

app.get(
  "/health",
  (req, res) => {
    res.json({
      success: true,
      status: "healthy",
      service:
        "day12-auth-rbac"
    });
  }
);

app.use(
  "/api/v1/auth",
  authRoutes
);

app.get(
  "/api/v1/protected",
  require("./middleware/auth").authenticate,
  (req, res) => {
    res.json({
      success: true,
      message:
        "Authenticated request successful",
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    });
  }
);

app.use(errorHandler);

const connectDatabase =
  async () => {
    await mongoose.connect(
      MONGODB_URI
    );

    console.log(
      "MongoDB connected successfully"
    );
  };

const startServer =
  async () => {
    try {
      await connectDatabase();

      app.listen(
        PORT,
        () => {
          console.log(
            `Day 12 server running on http://localhost:${PORT}`
          );
        }
      );
    } catch (error) {
      console.error(
        "Failed to start server:",
        error.message
      );

      process.exit(1);
    }
  };

if (
  require.main === module
) {
  startServer();
}

module.exports = {
  app,
  startServer
};