const redis = require("redis");

let client;

function getRedisClient() {
  if (!client) {
    client = redis.createClient({
      host: process.env.REDIS_HOST, // 'redis_server' when in Docker
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    client.on("error", (err) => {
      console.error("Redis client error:", err);
    });

    // Optional: Test connection on startup
    client.on("connect", () => {
      console.log("Connected to Redis!");
    });
  }
  return client;
}

module.exports = getRedisClient();
