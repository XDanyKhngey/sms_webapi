const mongoose = require("mongoose");
const dbServer = process.env.DB_SERVER;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
let MONGO_URI = "";

if (dbUser && dbPassword) {
  // Use credentials if provided
  MONGO_URI = `mongodb://${dbUser}:${dbPassword}@${dbServer}/${dbName}`;
} else {
  // Exclude credentials for unauthenticated connections
  MONGO_URI = `mongodb://${dbServer}/${dbName}`;
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = mongoose;
