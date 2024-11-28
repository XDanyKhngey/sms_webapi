const mongoose = require("mongoose");
const Parent = require("../models/parent");

const UserService = require("../services/user.service");
const userService = new UserService();

const RoleService = require("../services/role.service");
const roleService = new RoleService();

const redisClient = require("../utils/redis.util"); // Import the Redis utility

class ParentService {
  async GetAll() {
    try {
      const cacheKey = "parent:getAll";
      // Check if data is in Redis
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData); // Return cached data
      }

      const parents = await Parent.find({})
        .populate("user")
        .populate("student");

      await redisClient.set(cacheKey, JSON.stringify(parents), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return parents;
    } catch (error) {
      throw new Error(`Error fetching parents: ${error.message}`);
    }
  }

  async GetById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const cacheKey = `parent:getById:${id}`;
      // Check if data is in Redis
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData); // Return cached data
      }

      const parent = await Parent.findById(id)
        .populate("user")
        .populate("student");

      if (!parent) {
        throw new Error("Parent not found");
      }

      await redisClient.set(cacheKey, JSON.stringify(parent), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return parent;
    } catch (error) {
      throw new Error(`Error fetching parent by ID: ${error.message}`);
    }
  }

  async Create(data) {
    try {
      //get student role
      const role = await roleService.getByName("parent");

      //create user
      const user = await userService.create({
        email: data.email,
        password: data.password,
        role: role._id,
      });

      const newParent = new Parent({
        user: user._id,
        student: data.student,
        firstname: data.firstname,
        lastname: data.lastname,
        dob: data.dob,
        sex: data.sex,
        relationship: data.relationship,
        mobile_phone: data.mobile_phone,
        address: data.address,
      });

      await redisClient.del("parent:getAll");

      return await newParent.save();
    } catch (error) {
      throw new Error(`Error creating parent: ${error.message}`);
    }
  }

  async Update(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const updatedParent = await Parent.findByIdAndUpdate(
        id,
        {
          firstname: data.firstname,
          lastname: data.lastname,
          dob: data.dob,
          sex: data.sex,
          relationship: data.relationship,
          mobile_phone: data.mobile_phone,
          address: data.address,
        },
        { new: true, runValidators: true } // Return the updated document
      );

      if (!updatedParent) {
        throw new Error("Parent not found or update failed");
      }

      await redisClient.del("parent:getAll");
      await redisClient.del(`parent:getById:${id}`);

      return updatedParent;
    } catch (error) {
      throw new Error(`Error updating parent: ${error.message}`);
    }
  }

  async Delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const parent = await this.GetById(id);

      await userService.deleteUser(parent.user._id);

      const deletedParent = await Parent.findByIdAndDelete(id);

      if (!deletedParent) {
        throw new Error("Parent not found or already deleted");
      }

      await redisClient.del("parent:getAll");
      await redisClient.del(`parent:getById:${id}`);
      await redisClient.del(`user.getById:${parent.user._id}`);

      return {
        message: "Parent successfully deleted",
        parent: deletedParent,
      };
    } catch (error) {
      throw new Error(`Error deleting parent: ${error.message}`);
    }
  }
}

module.exports = ParentService;
