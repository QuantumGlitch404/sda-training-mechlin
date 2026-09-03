const { performance } = require("perf_hooks");

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.startTime = Date.now();
  }

  startTimer(name) {
    this.metrics.set(name, {
      start: performance.now()
    });
  }

  endTimer(name) {
    const timer = this.metrics.get(name);

    if (!timer) {
      return null;
    }

    const end = performance.now();
    const duration = end - timer.start;

    this.metrics.set(name, {
      ...timer,
      duration,
      end
    });

    return duration;
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

      timers: Object.fromEntries(this.metrics),

      process: {
        pid: process.pid,
        version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
  }

  reset() {
    this.metrics.clear();
    this.startTime = Date.now();
  }
}

const performanceMonitor = new PerformanceMonitor();

const performanceMiddleware = (req, res, next) => {
  const startTime = performance.now();

  res.on("finish", () => {
    const duration = performance.now() - startTime;
    const memoryUsage = process.memoryUsage();

    console.log({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      memory: {
        heapUsed:
          `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,

        heapTotal:
          `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`
      },
      timestamp: new Date().toISOString()
    });
  });

  next();
};

module.exports = {
  PerformanceMonitor,
  performanceMonitor,
  performanceMiddleware
};