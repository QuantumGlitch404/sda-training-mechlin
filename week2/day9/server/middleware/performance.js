const {
  performance
} = require("perf_hooks");

class PerformanceMonitor {
  constructor() {
    this.startTime =
      Date.now();

    this.metrics =
      new Map();
  }

  startTimer(name) {
    this.metrics.set(
      name,
      {
        start:
          performance.now()
      }
    );
  }

  endTimer(name) {
    const timer =
      this.metrics.get(
        name
      );

    if (!timer) {
      return null;
    }

    const end =
      performance.now();

    const duration =
      end -
      timer.start;

    this.metrics.set(
      name,
      {
        ...timer,
        end,
        duration
      }
    );

    return duration;
  }

  getMetrics() {
    const memory =
      process.memoryUsage();

    return {
      uptime:
        Date.now() -
        this.startTime,

      memory: {
        rss: memory.rss,
        heapTotal:
          memory.heapTotal,
        heapUsed:
          memory.heapUsed,
        external:
          memory.external
      },

      timers:
        Object.fromEntries(
          this.metrics
        ),

      process: {
        pid:
          process.pid,
        version:
          process.version,
        platform:
          process.platform,
        arch:
          process.arch
      }
    };
  }
}

const performanceMonitor =
  new PerformanceMonitor();

const performanceMiddleware =
  (req, res, next) => {
    const start =
      performance.now();

    res.on(
      "finish",
      () => {
        const duration =
          performance.now() -
          start;

        console.log({
          method:
            req.method,
          url:
            req.originalUrl,
          statusCode:
            res.statusCode,
          duration:
            `${duration.toFixed(2)}ms`,
          timestamp:
            new Date().toISOString()
        });
      }
    );

    next();
  };

module.exports = {
  PerformanceMonitor,
  performanceMonitor,
  performanceMiddleware
};