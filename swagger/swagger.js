require("dotenv").config();
const swaggerAutogen = require("swagger-autogen");

const doc = {
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // optional but useful for clarification
      },
    },
  },
  info: {
    title: "School Management System API",
    description: "School Management System API Documentation.",
  },
  basePath: "/api/v1", // Set the API global prefix
  security: [{ bearerAuth: [] }], // Apply the security globally
};

const outputFile = "./swagger-output.json";
const routes = ["../routes/index.js"]; // Ensure this points to your actual route files

swaggerAutogen(outputFile, routes, doc);
