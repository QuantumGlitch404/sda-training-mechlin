const express = require('express');

const userRoutes = require('./routes/userRoutes');
const { setupSwagger } = require('./middleware/swagger');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Day 13 API is running'
  });
});

app.use('/api/v1/users', userRoutes);

setupSwagger(app);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND'
    }
  });
});

if (require.main === module) {
  const PORT = 3013;

  app.listen(PORT, () => {
    console.log(`Day 13 API running on http://localhost:${PORT}`);
    console.log(
      `Swagger UI: http://localhost:${PORT}/api/v1/docs/`
    );
  });
}

module.exports = app;