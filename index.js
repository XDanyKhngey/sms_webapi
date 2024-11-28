require("dotenv").config();
require("./db/db.mongo.js");
const express = require("express");
const redisClient = require("./utils/redis.util"); // Import Redis utility
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger/swagger-output.json"); // Generated file by swagger-autogen
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const routes = require("./routes"); // Import the central route file

const app = express();
const port = process.env.PORT || 3000;
const STAGE = process.env.STAGE;

// Redis Connection
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:", err);
    process.exit(1); // Exit the process if Redis connection fails
  }
})();

// Middleware for JSON parsing
app.use(express.json());

// Global prefix for all routes
const globalPrefix = "/api/v1";

if (STAGE === "DEV") {
  // Serve Swagger documentation on dev server
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || 30), // 30 requests per window
});
app.use(limiter);

// CORS configuration based on environment variables
const allowedOrigins = process.env.CORS_ORIGIN.split(","); // Convert comma-separated origins to an array

const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.CORS_ENABLED === "true") {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS"), false); // Reject the origin
      }
    } else {
      callback(null, true); // Allow all origins if CORS is disabled
    }
  },
  methods: process.env.CORS_METHODS || "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders:
    process.env.CORS_ALLOWED_HEADERS || "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// Use global prefix for routes
app.use(globalPrefix, routes);

// Start Server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
