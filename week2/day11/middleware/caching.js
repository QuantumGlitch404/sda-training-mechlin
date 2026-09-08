const redis = require("redis");

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      return;
    }

    this.client = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    this.client.on("connect", () => {
      this.isConnected = true;
      console.log("Redis connected successfully");
    });

    this.client.on("error", (error) => {
      this.isConnected = false;
      console.error("Redis connection error:", error.message);
    });

    await this.client.connect();
  }

  async get(key) {
    try {
      if (!this.isConnected) {
        return null;
      }

      const value = await this.client.get(key);

      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis get error:", error.message);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.client.setEx(
        key,
        ttl,
        JSON.stringify(value)
      );

      return true;
    } catch (error) {
      console.error("Redis set error:", error.message);
      return false;
    }
  }

  async del(key) {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.client.del(key);

      return true;
    } catch (error) {
      console.error("Redis delete error:", error.message);
      return false;
    }
  }

  async flush() {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.client.flushAll();

      return true;
    } catch (error) {
      console.error("Redis flush error:", error.message);
      return false;
    }
  }

  generateKey(prefix, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|");

    return sortedParams
      ? `${prefix}:${sortedParams}`
      : prefix;
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

const cacheService = new CacheService();

const cache = (ttl = 3600, keyGenerator = null) => {
  return async (req, res, next) => {
    try {
      const cacheKey = keyGenerator
        ? keyGenerator(req)
        : cacheService.generateKey(
            req.path,
            req.query
          );

      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        res.set("X-Cache", "HIT");
        return res.json(cachedData);
      }

      const originalJson = res.json.bind(res);

      res.json = (data) => {
        cacheService.set(cacheKey, data, ttl);
        res.set("X-Cache", "MISS");

        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error.message);
      next();
    }
  };
};

module.exports = {
  cacheService,
  cache
};