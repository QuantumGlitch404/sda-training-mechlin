const os = require('os');
const process = require('process');

const healthCheck = {
  async checkEnvironment() {
    try {
      const environment =
        process.env.NODE_ENV ||
        'development';

      return {
        status: 'healthy',
        message:
          'Environment configuration loaded',

        details: {
          environment,
          nodeVersion:
            process.version,
          platform:
            process.platform
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message
      };
    }
  },

  async checkSystem() {
    const memory =
      process.memoryUsage();

    return {
      status: 'healthy',

      uptime:
        process.uptime(),

      memory: {
        rss: memory.rss,
        heapTotal:
          memory.heapTotal,
        heapUsed:
          memory.heapUsed,
        external:
          memory.external
      },

      cpu: {
        loadavg:
          os.loadavg(),
        cpus:
          os.cpus().length
      },

      platform:
        os.platform(),

      arch:
        os.arch(),

      nodeVersion:
        process.version
    };
  },

  async performHealthCheck() {
    const checks =
      await Promise.all([
        this.checkEnvironment(),
        this.checkSystem()
      ]);

    const results = {
      environment:
        checks[0],

      system:
        checks[1]
    };

    const overallStatus =
      Object.values(
        results
      ).every(
        (check) =>
          check.status ===
          'healthy'
      )
        ? 'healthy'
        : 'unhealthy';

    return {
      status:
        overallStatus,

      timestamp:
        new Date().toISOString(),

      checks: results
    };
  }
};

module.exports =
  healthCheck;