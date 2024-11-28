const mongoose = require("mongoose");
const Teacher = require("../models/teacher");

const UserService = require("../services/user.service");
const userService = new UserService();

const RoleService = require("../services/role.service");
const roleService = new RoleService();

const redisClient = require("../utils/redis.util");

class TeacherService {
  async GetAll() {
    try {
      const cacheKey = "teacher:getAll";
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const teachers = await Teacher.find({}).populate("user");

      await redisClient.set(cacheKey, JSON.stringify(teachers), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return teachers;
    } catch (error) {
      throw new Error(`Error fetching teachers: ${error.message}`);
    }
  }

  async GetById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const cacheKey = `teacher:getById:${id}`;
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const teacher = await Teacher.findById(id).populate("user");

      if (!teacher) {
        throw new Error("Teacher not found");
      }

      await redisClient.set(cacheKey, JSON.stringify(teacher), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return teacher;
    } catch (error) {
      throw new Error(`Error fetching teacher by ID: ${error.message}`);
    }
  }

  async Create(data) {
    try {
      //get student role
      const role = await roleService.getByName("teacher");

      //create user
      const user = await userService.create({
        email: data.email,
        password: data.password,
        role: role._id,
      });

      const newTeacher = new Teacher({
        user: user._id,
        firstname: data.firstname,
        lastname: data.lastname,
        dob: data.dob,
        sex: data.sex,
        degree: data.degree,
        mobile_phone: data.mobile_phone,
        address: data.address,
      });

      const teacher = await newTeacher.save();

      redisClient.del("teacher:getAll");

      return teacher;
    } catch (error) {
      throw new Error(`Error creating teacher: ${error.message}`);
    }
  }

  async Update(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const updatedTeacher = await Teacher.findByIdAndUpdate(
        id,
        {
          firstname: data.firstname,
          lastname: data.lastname,
          dob: data.dob,
          sex: data.sex,
          degree: data.degree,
          mobile_phone: data.mobile_phone,
          address: data.address,
        },
        { new: true, runValidators: true } // Return updated document
      );

      if (!updatedTeacher) {
        throw new Error("Teacher not found or update failed");
      }

      redisClient.del("teacher:getAll");
      redisClient.del(`teacher:getById:${id}`);

      return updatedTeacher;
    } catch (error) {
      throw new Error(`Error updating teacher: ${error.message}`);
    }
  }

  async Delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const teacher = await this.GetById(id);

      await userService.deleteUser(teacher.user._id);

      const deletedTeacher = await Teacher.findByIdAndDelete(id);

      if (!deletedTeacher) {
        throw new Error("Teacher not found or already deleted");
      }

      redisClient.del("teacher:getAll");
      redisClient.del(`teacher:getById:${id}`);
      await redisClient.del(`user.getById:${teacher.user._id}`);
      return {
        message: "Teacher successfully deleted",
        teacher: deletedTeacher,
      };
    } catch (error) {
      throw new Error(`Error deleting teacher: ${error.message}`);
    }
  }
}

module.exports = TeacherService;
