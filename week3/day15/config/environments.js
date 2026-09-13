const environments = {
  development: {
    name: 'development',

    port: Number(
      process.env.PORT || 3015
    ),

    database: {
      mongodb: {
        uri:
          process.env.MONGODB_URI ||
          'mongodb://localhost:27017/sda-training-dev',

        options: {
          serverSelectionTimeoutMS: 5000
        }
      },

      postgresql: {
        host:
          process.env.POSTGRES_HOST ||
          'localhost',

        port: Number(
          process.env.POSTGRES_PORT ||
          5432
        ),

        database:
          process.env.POSTGRES_DB ||
          'sda_training_dev',

        username:
          process.env.POSTGRES_USER ||
          'postgres',

        password:
          process.env.POSTGRES_PASSWORD ||
          'password'
      },

      redis: {
        url:
          process.env.REDIS_URL ||
          'redis://localhost:6379',

        options: {
          maxRetriesPerRequest: 3
        }
      }
    },

    api: {
      baseUrl:
        process.env.API_BASE_URL ||
        'http://localhost:3015/api/v1',

      timeout: 30000,
      retries: 3
    },

    security: {
      jwtSecret:
        process.env.JWT_SECRET ||
        'development-secret',

      jwtExpiresIn:
        process.env.JWT_EXPIRES_IN ||
        '7d',

      bcryptRounds: Number(
        process.env.BCRYPT_ROUNDS ||
        10
      )
    },

    logging: {
      level:
        process.env.LOG_LEVEL ||
        'debug',

      format: 'json',
      file: 'logs/development.log'
    }
  },

  staging: {
    name: 'staging',

    port: Number(
      process.env.PORT || 3015
    ),

    database: {
      mongodb: {
        uri:
          process.env.MONGODB_URI || '',

        options: {
          serverSelectionTimeoutMS: 5000,
          ssl: true,
          sslValidate: true
        }
      },

      postgresql: {
        host:
          process.env.POSTGRES_HOST || '',

        port: Number(
          process.env.POSTGRES_PORT ||
          5432
        ),

        database:
          process.env.POSTGRES_DB || '',

        username:
          process.env.POSTGRES_USER || '',

        password:
          process.env.POSTGRES_PASSWORD ||
          '',

        ssl: {
          rejectUnauthorized: false
        }
      },

      redis: {
        url:
          process.env.REDIS_URL || '',

        options: {
          maxRetriesPerRequest: 3,
          tls: {}
        }
      }
    },

    api: {
      baseUrl:
        process.env.API_BASE_URL || '',

      timeout: 30000,
      retries: 3
    },

    security: {
      jwtSecret:
        process.env.JWT_SECRET || '',

      jwtExpiresIn:
        process.env.JWT_EXPIRES_IN ||
        '1d',

      bcryptRounds: 12
    },

    logging: {
      level:
        process.env.LOG_LEVEL ||
        'info',

      format: 'json',
      file: 'logs/staging.log'
    }
  },

  production: {
    name: 'production',

    port: Number(
      process.env.PORT || 3015
    ),

    database: {
      mongodb: {
        uri:
          process.env.MONGODB_URI || '',

        options: {
          serverSelectionTimeoutMS: 5000,
          ssl: true,
          sslValidate: true,
          authSource: 'admin'
        }
      },

      postgresql: {
        host:
          process.env.POSTGRES_HOST || '',

        port: Number(
          process.env.POSTGRES_PORT ||
          5432
        ),

        database:
          process.env.POSTGRES_DB || '',

        username:
          process.env.POSTGRES_USER || '',

        password:
          process.env.POSTGRES_PASSWORD ||
          '',

        ssl: {
          rejectUnauthorized: true
        },

        pool: {
          min: 2,
          max: 10
        }
      },

      redis: {
        url:
          process.env.REDIS_URL || '',

        options: {
          maxRetriesPerRequest: 3,
          tls: {},
          lazyConnect: true
        }
      }
    },

    api: {
      baseUrl:
        process.env.API_BASE_URL || '',

      timeout: 30000,
      retries: 3
    },

    security: {
      jwtSecret:
        process.env.JWT_SECRET || '',

      jwtExpiresIn:
        process.env.JWT_EXPIRES_IN ||
        '1h',

      bcryptRounds: 12
    },

    logging: {
      level:
        process.env.LOG_LEVEL ||
        'warn',

      format: 'json',
      file: 'logs/production.log'
    }
  }
};

const getEnvironment = () => {
  const env =
    process.env.NODE_ENV ||
    'development';

  return (
    environments[env] ||
    environments.development
  );
};

module.exports = {
  environments,
  getEnvironment
};