const mongoose = require("mongoose");
const Course = require("../models/course");
const redisClient = require("../utils/redis.util"); // Import the Redis utility

class CourseService {
  async GetAll() {
    try {
      const cacheKey = "course:getAll";
      // Check if data is in Redis
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData); // Return cached data
      }

      const course = await Course.find({});
      await redisClient.set(cacheKey, JSON.stringify(course), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return course;
    } catch (error) {
      throw new Error(`Error fetching courses: ${error.message}`);
    }
  }

  async GetById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const cacheKey = `course:getById:${id}`;

      // Check if data is in Redis
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData); // Return cached data
      }

      const course = await Course.findById(id);

      await redisClient.set(cacheKey, JSON.stringify(course), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      if (!course) {
        throw new Error("Course not found");
      }

      return course;
    } catch (error) {
      throw new Error(`Error fetching course by ID: ${error.message}`);
    }
  }

  async Create(data) {
    try {
      const newCourse = new Course({
        name: data.name,
        price: data.price,
        desc: data.desc,
      });

      const course = await newCourse.save();

      await redisClient.del("course:getAll");

      return course;
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  async Update(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        {
          name: data.name,
          price: data.price,
          desc: data.desc,
        },
        { new: true, runValidators: true } // Return updated document and validate changes
      );

      if (!updatedCourse) {
        throw new Error("Course not found or update failed");
      }

      await redisClient.del("course:getAll");
      await redisClient.del(`course:getById:${id}`);

      return updatedCourse;
    } catch (error) {
      throw new Error(`Error updating course: ${error.message}`);
    }
  }

  async Delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const deletedCourse = await Course.findByIdAndDelete(id);

      if (!deletedCourse) {
        throw new Error("Course not found or already deleted");
      }

      await redisClient.del("course:getAll");
      await redisClient.del(`course:getById:${id}`);

      return { message: "Course successfully deleted", course: deletedCourse };
    } catch (error) {
      throw new Error(`Error deleting course: ${error.message}`);
    }
  }
}

module.exports = CourseService;
