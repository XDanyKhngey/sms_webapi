// user.seed.js
const User = require("../../models/user");
const Role = require("../../models/role");
const BcryptService = require("../../services/bcrypt.service");
const bcryptService = new BcryptService(12);

const seedUsers = async () => {
  try {
    const adminRole = await Role.findOne({ name: "admin" });
    const studentRole = await Role.findOne({ name: "student" });
    const teacherRole = await Role.findOne({ name: "teacher" });

    const users = [
      {
        email: "admin@example.com",
        password: await bcryptService.hashPassword("123"),
        role: adminRole._id,
        refresh_token: "1efa8f05-0a19-6980-a0f4-107f55b6e838",
        refresh_token_expire: new Date(),
      },
      {
        email: "student@example.com",
        password: await bcryptService.hashPassword("123"),
        role: studentRole._id,
        refresh_token: "1efa8f05-0a19-6980-a0f4-107f55b6e838",
        refresh_token_expire: new Date(),
      },
      {
        email: "teacher@example.com",
        password: await bcryptService.hashPassword("123"),
        role: teacherRole._id,
        refresh_token: "1efa8f05-0a19-6980-a0f4-107f55b6e838",
        refresh_token_expire: new Date(),
      },
    ];
    await User.insertMany(users);
    console.log("Users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

module.exports = seedUsers;
