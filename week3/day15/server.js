require('dotenv').config();

const http =
  require('http');

const winston =
  require('winston');

const {
  getEnvironment
} = require('./config/environments');

const secrets =
  require('./config/secrets');

const healthCheck =
  require('./monitoring/health-check');

const environment =
  getEnvironment();

const logger =
  winston.createLogger({
    level:
      environment.logging.level,

    format:
      winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),

    defaultMeta: {
      service:
        'sda-training-day15'
    },

    transports: [
      new winston.transports.Console()
    ]
  });

const server =
  http.createServer(
    async (req, res) => {
      logger.info({
        message:
          'Request received',
        method:
          req.method,
        url:
          req.url
      });

      if (
        req.url ===
          '/health' &&
        req.method === 'GET'
      ) {
        const health =
          await healthCheck.performHealthCheck();

        res.writeHead(
          health.status ===
            'healthy'
            ? 200
            : 503,
          {
            'Content-Type':
              'application/json'
          }
        );

        res.end(
          JSON.stringify(
            health,
            null,
            2
          )
        );

        return;
      }

      if (
        req.url ===
          '/config' &&
        req.method === 'GET'
      ) {
        const config =
          getEnvironment();

        res.writeHead(
          200,
          {
            'Content-Type':
              'application/json'
          }
        );

        res.end(
          JSON.stringify(
            {
              environment:
                config.name,

              port:
                config.port,

              api:
                config.api,

              logging:
                config.logging
            },
            null,
            2
          )
        );

        return;
      }

      if (
        req.url ===
          '/secrets/status' &&
        req.method === 'GET'
      ) {
        const status =
          secrets.validateSecrets();

        res.writeHead(
          200,
          {
            'Content-Type':
              'application/json'
          }
        );

        res.end(
          JSON.stringify(
            status,
            null,
            2
          )
        );

        return;
      }

      if (
        req.url === '/' &&
        req.method === 'GET'
      ) {
        res.writeHead(
          200,
          {
            'Content-Type':
              'application/json'
          }
        );

        res.end(
          JSON.stringify(
            {
              success: true,
              message:
                'Day 15 DevOps API is running',
              environment:
                environment.name
            },
            null,
            2
          )
        );

        return;
      }

      res.writeHead(
        404,
        {
          'Content-Type':
            'application/json'
        }
      );

      res.end(
        JSON.stringify(
          {
            success: false,
            error:
              'Route not found'
          },
          null,
          2
        )
      );
    }
  );

const PORT =
  environment.port;

if (
  require.main ===
  module
) {
  server.listen(
    PORT,
    () => {
      logger.info({
        message:
          'Day 15 server started',
        environment:
          environment.name,
        port:
          PORT
      });

      console.log(
        `Day 15 server running on http://localhost:${PORT}`
      );

      console.log(
        `Health: http://localhost:${PORT}/health`
      );

      console.log(
        `Config: http://localhost:${PORT}/config`
      );

      console.log(
        `Secrets: http://localhost:${PORT}/secrets/status`
      );
    }
  );
}

module.exports =
  server;