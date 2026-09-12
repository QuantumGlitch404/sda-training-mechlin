const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes/apiRoutes');

const {
  monitoringMiddleware,
  healthCheck,
  metrics
} = require('./middleware/monitoring');

const app = express();

app.use(
  cors({
    origin: true
  })
);

app.use(express.json());

app.use(monitoringMiddleware);

app.get(
  '/health',
  healthCheck
);

app.get(
  '/metrics',
  metrics
);

app.use(
  '/api/v1',
  apiRoutes
);

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        message:
          'Route not found'
      }
    });
  }
);

if (
  require.main === module
) {
  const PORT = 3014;

  app.listen(
    PORT,
    () => {
      console.log(
        `Day 14 API running on http://localhost:${PORT}`
      );

      console.log(
        `Health: http://localhost:${PORT}/health`
      );

      console.log(
        `Metrics: http://localhost:${PORT}/metrics`
      );
    }
  );
}

module.exports = app;