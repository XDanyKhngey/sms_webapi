const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/user");

const BcryptService = require("../services/bcrypt.service");
const bcryptService = new BcryptService(12);

const redisClient = require("../utils/redis.util");

class UserService {
  async getAll() {
    try {
      const cacheKey = "user:getAll";
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const users = await User.find().populate("role");

      await redisClient.set(cacheKey, JSON.stringify(users), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return users;
    } catch (error) {
      throw new Error(`Failed to get all Users: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const cacheKey = `user:getById:${id}`;
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const user = await User.findOne({
        _id: id,
      }).populate("role");

      await redisClient.set(cacheKey, JSON.stringify(user), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to get User: ${error.message}`);
    }
  }

  async getByEmailWithPassword(email) {
    try {
      return await User.findOne({
        email: email,
      })
        .select("+password")
        .populate("role");
    } catch (error) {
      throw new Error(`Failed to get User: ${error.message}`);
    }
  }

  async create(UserData) {
    try {
      // Hash the password before saving it
      const hashedPassword = await bcryptService.hashPassword(
        UserData.password
      );

      // Create the new user
      const newUser = new User({
        email: UserData.email,
        password: hashedPassword,
        role: UserData.role, // Ensure role is an ObjectId
      });

      // Save the user and wait for the result
      const result = await newUser.save();

      await redisClient.del("user:getAll");

      // Get the newly created user by ID and return
      return await this.getById(result._id);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findOne({ _id: userId }).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the current password is correct
    const isPasswordCorrect = await bcryptService.comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Incorrect current password");
    }

    // Hash the new password
    const hashedPassword = await bcryptService.hashPassword(newPassword);

    // Update the user's password
    const result = await User.updateOne(
      { _id: userId },
      { password: hashedPassword }
    );

    // Optionally check if the update was successful and return the appropriate response
    if (result.nModified === 0) {
      throw new Error("Failed to update password");
    }

    return { message: "Password updated successfully" };
  }

  async updateRefreshToken(userId, refreshToken) {
    try {
      const result = await User.updateOne(
        {
          _id: userId,
        },
        {
          refresh_token: refreshToken,
          refresh_token_expire: new Date().setHours(
            Number(process.env.REFRESH_TOKEN_EXPIRED_IN_HOUR || 48)
          ),
        }
      );
      if (result.nModified === 0) {
        throw new Error("Failed to update refresh token!");
      }
      await redisClient.del(`user.getAll`);
      await redisClient.del(`user.getById:${userId}`);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid ID format");
      }

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw new Error("User not found or already deleted");
      }

      await redisClient.del("user:getAll");
      await redisClient.del(`user.getById:${id}`);

      return {
        message: "User successfully deleted",
        student: deletedUser,
      };
    } catch (error) {
      throw new Error(`Error deleting student: ${error.message}`);
    }
  }
}

module.exports = UserService;
