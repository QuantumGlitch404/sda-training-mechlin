const express = require('express');
const os = require('os');

const app = express();

const PORT = Number(
  process.env.PORT || 3000
);

const HOST =
  process.env.HOST || '0.0.0.0';

const startTime = Date.now();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Day 16 Docker API is running',
    environment:
      process.env.NODE_ENV || 'development',
    hostname: os.hostname()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'day16-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/metrics', (req, res) => {
  const memory = process.memoryUsage();

  const uptime =
    (Date.now() - startTime) / 1000;

  res.type('text/plain');

  res.send(
    [
      '# HELP app_uptime_seconds Application uptime in seconds',
      '# TYPE app_uptime_seconds gauge',
      `app_uptime_seconds ${uptime}`,

      '# HELP app_memory_heap_used_bytes Node.js heap used in bytes',
      '# TYPE app_memory_heap_used_bytes gauge',
      `app_memory_heap_used_bytes ${memory.heapUsed}`,

      '# HELP app_memory_rss_bytes Node.js RSS memory in bytes',
      '# TYPE app_memory_rss_bytes gauge',
      `app_memory_rss_bytes ${memory.rss}`,

      '# HELP app_node_process_start_time_seconds Process start time',
      '# TYPE app_node_process_start_time_seconds gauge',
      `${'app_node_process_start_time_seconds'} ${Math.floor((Date.now() - startTime) / 1000)}`
    ].join('\n')
  );
});

app.get('/api/v1/info', (req, res) => {
  res.json({
    service: 'day16-api',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    hostname: os.hostname()
  });
});

app.listen(
  PORT,
  HOST,
  () => {
    console.log(
      `Day 16 API listening on ${HOST}:${PORT}`
    );
  }
);

module.exports = app;