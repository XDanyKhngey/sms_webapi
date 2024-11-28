// role.seed.js
const Role = require("../../models/role");

const seedRoles = async () => {
  try {
    await Role.deleteMany({}); // Clear existing roles
    const roles = [
      { name: "admin", description: "administrator with full access" },
      { name: "student", description: "student user with limited access" },
      { name: "teacher", description: "teacher user with special permissions" },
      { name: "parent", description: "parent user with special permissions" },
    ];
    await Role.insertMany(roles);
    console.log("Roles seeded successfully!");
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
};

module.exports = seedRoles;
