const {
  Pool
} = require("pg");

const {
  logger
} = require(
  "../utils/logger"
);

class PostgreSQLConnection {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.pool =
        new Pool({
          user:
            process.env.POSTGRES_USER ||
            "postgres",

          host:
            process.env.POSTGRES_HOST ||
            "localhost",

          database:
            process.env.POSTGRES_DB ||
            "sda_training",

          password:
            process.env.POSTGRES_PASSWORD ||
            "password",

          port:
            Number(
              process.env.POSTGRES_PORT ||
                5432
            ),

          max: 20,

          idleTimeoutMillis:
            30000,

          connectionTimeoutMillis:
            5000
        });

      const client =
        await this.pool.connect();

      await client.query(
        "SELECT NOW()"
      );

      client.release();

      this.isConnected = true;

      logger.info(
        "PostgreSQL connected successfully"
      );

      this.pool.on(
        "error",
        (error) => {
          logger.error(
            "PostgreSQL pool error",
            {
              error:
                error.message
            }
          );

          this.isConnected = false;
        }
      );

      return this.getConnectionStatus();
    } catch (error) {
      logger.error(
        "PostgreSQL connection failed",
        {
          error:
            error.message
        }
      );

      throw error;
    }
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();

      this.pool = null;
      this.isConnected = false;

      logger.info(
        "PostgreSQL disconnected"
      );
    }
  }

  async query(
    text,
    params = []
  ) {
    if (!this.pool) {
      throw new Error(
        "PostgreSQL is not connected"
      );
    }

    const start =
      Date.now();

    try {
      const result =
        await this.pool.query(
          text,
          params
        );

      const duration =
        Date.now() - start;

      logger.info(
        "PostgreSQL query executed",
        {
          duration,
          rows:
            result.rowCount
        }
      );

      return result;
    } catch (error) {
      logger.error(
        "PostgreSQL query failed",
        {
          error:
            error.message
        }
      );

      throw error;
    }
  }

  async getClient() {
    if (!this.pool) {
      throw new Error(
        "PostgreSQL is not connected"
      );
    }

    return this.pool.connect();
  }

  getConnectionStatus() {
    return {
      isConnected:
        this.isConnected,

      totalCount:
        this.pool?.totalCount ||
        0,

      idleCount:
        this.pool?.idleCount ||
        0,

      waitingCount:
        this.pool?.waitingCount ||
        0
    };
  }
}

module.exports =
  new PostgreSQLConnection();