require("dotenv").config();
const mongoose = require("../../db/db.mongo");
const seedRoles = require("./role.seed");
const seedUsers = require("./user.seed");

const seedData = async () => {
  try {
    const rolesExist = await mongoose.models.Role.countDocuments({});
    if (rolesExist === 0) {
      console.log("Seeding roles...");
      await seedRoles(); // Ensure roles are seeded before users
    } else {
      console.log("Roles already exist. Skipping role seeding.");
    }

    const usersExist = await mongoose.models.User.countDocuments({});
    if (usersExist === 0) {
      console.log("Seeding users...");
      await seedUsers();
    } else {
      console.log("Users already exist. Skipping user seeding.");
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    mongoose.disconnect(); // Disconnect after all seeds are completed
    console.log("Disconnected from MongoDB");
  }
};

mongoose.connection.on("connected", async () => {
  await seedData();
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
