const winston = require('winston');
const { performance } = require('perf_hooks');

const logger = winston.createLogger({
  level: 'info',

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  defaultMeta: {
    service: 'sda-training-day14-api'
  },

  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),

    new winston.transports.File({
      filename: 'logs/combined.log'
    }),

    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class MonitoringService {
  constructor() {
    this.metrics = new Map();
    this.startTime = Date.now();
  }

  recordRequest(req, res, duration) {
    const metric = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: Number(duration.toFixed(2)),
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent') || 'unknown',
      ip: req.ip || 'unknown',
      userId: req.user?.id || null
    };

    logger.info('Request processed', metric);

    this.updateMetrics(metric);
  }

  recordError(error, req) {
    logger.error('Request error', {
      message: error.message,
      stack: error.stack,
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }

  updateMetrics(metric) {
    const key = `${metric.method}:${metric.url}`;

    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        count: 0,
        totalDuration: 0,
        errors: 0,
        lastRequest: null
      });
    }

    const stats = this.metrics.get(key);

    stats.count += 1;
    stats.totalDuration += metric.duration;
    stats.lastRequest = metric.timestamp;

    if (metric.statusCode >= 400) {
      stats.errors += 1;
    }
  }

  getMetrics() {
    const memoryUsage = process.memoryUsage();

    return {
      uptime: Date.now() - this.startTime,

      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external
      },

      requestMetrics: Object.fromEntries(this.metrics),

      process: {
        pid: process.pid,
        version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
  }

  calculateErrorRate() {
    const allStats = Array.from(this.metrics.values());

    const totalRequests = allStats.reduce(
      (sum, item) => sum + item.count,
      0
    );

    const totalErrors = allStats.reduce(
      (sum, item) => sum + item.errors,
      0
    );

    if (totalRequests === 0) {
      return 0;
    }

    return Number(
      ((totalErrors / totalRequests) * 100).toFixed(2)
    );
  }

  getHealthStatus() {
    const metrics = this.getMetrics();

    const memoryUsagePercent =
      (metrics.memory.heapUsed / metrics.memory.heapTotal) * 100;

    return {
      status:
        memoryUsagePercent > 90
          ? 'unhealthy'
          : 'healthy',

      uptime: metrics.uptime,

      memoryUsage: Number(
        memoryUsagePercent.toFixed(2)
      ),

      requestCount: Array.from(
        this.metrics.values()
      ).reduce(
        (sum, stat) => sum + stat.count,
        0
      ),

      errorRate: this.calculateErrorRate()
    };
  }
}

const monitoringService =
  new MonitoringService();

const monitoringMiddleware =
  (req, res, next) => {
    const start = performance.now();

    res.on('finish', () => {
      const duration =
        performance.now() - start;

      monitoringService.recordRequest(
        req,
        res,
        duration
      );
    });

    next();
  };

const healthCheck = (req, res) => {
  res.json(
    monitoringService.getHealthStatus()
  );
};

const metrics = (req, res) => {
  res.json(
    monitoringService.getMetrics()
  );
};

module.exports = {
  monitoringService,
  monitoringMiddleware,
  healthCheck,
  metrics,
  logger
};