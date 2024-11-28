const mongoose = require("mongoose");
const Student = require("../models/student");
const redisClient = require("../utils/redis.util");

const UserService = require("../services/user.service");
const userService = new UserService();

const RoleService = require("../services/role.service");
const roleService = new RoleService();

class StudentService {
  async GetAll() {
    try {
      const cacheKey = "students:all";
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const students = await Student.find({}).populate("user");
      await redisClient.set(cacheKey, JSON.stringify(students), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return students;
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}`);
    }
  }

  async GetById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const cacheKey = `students:${id}`;
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const student = await Student.findById(id).populate("user");

      if (!student) {
        throw new Error("Student not found");
      }

      await redisClient.set(cacheKey, JSON.stringify(student), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return student;
    } catch (error) {
      throw new Error(`Error fetching student by ID: ${error.message}`);
    }
  }

  async Create(data) {
    try {
      const role = await roleService.getByName("student");
      const user = await userService.create({
        email: data.email,
        password: data.password,
        role: role._id,
      });

      const newStudent = new Student({
        user: user._id,
        firstname: data.firstname,
        lastname: data.lastname,
        dob: data.dob,
        sex: data.sex,
        mobile_phone: data.mobile_phone,
        address: data.address,
      });

      const savedStudent = await newStudent.save();
      await redisClient.del("students:all"); // Clear cache

      return savedStudent;
    } catch (error) {
      throw new Error(`Error creating student: ${error.message}`);
    }
  }

  async Update(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        {
          firstname: data.firstname,
          lastname: data.lastname,
          dob: data.dob,
          sex: data.sex,
          mobile_phone: data.mobile_phone,
          address: data.address,
        },
        { new: true, runValidators: true }
      );

      if (!updatedStudent) {
        throw new Error("Student not found or update failed");
      }

      await redisClient.del(`students:${id}`); // Clear cache for this student
      await redisClient.del("students:all"); // Clear cache for all students

      return updatedStudent;
    } catch (error) {
      throw new Error(`Error updating student: ${error.message}`);
    }
  }

  async Delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const student = await this.GetById(id);
      await userService.deleteUser(student.user._id);

      const deletedStudent = await Student.findByIdAndDelete(id);

      if (!deletedStudent) {
        throw new Error("Student not found or already deleted");
      }

      await redisClient.del(`students:${id}`); // Clear cache for this student
      await redisClient.del("students:all"); // Clear cache for all students
      await redisClient.del(`user.getById:${student.user._id}`);
      return {
        message: "Student successfully deleted",
        student: deletedStudent,
      };
    } catch (error) {
      throw new Error(`Error deleting student: ${error.message}`);
    }
  }
}

module.exports = StudentService;
