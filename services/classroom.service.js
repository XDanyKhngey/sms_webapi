const mongoose = require("mongoose");
const Classroom = require("../models/classroom");
const redisClient = require("../utils/redis.util"); // Import the Redis utility

class ClassroomService {
  async GetAll() {
    try {
      const cacheKey = "classrooms:getAll";

      // Check if data is in Redis
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData); // Return cached data
      }

      // Fetch from database if not in cache
      const classrooms = await Classroom.find({});
      await redisClient.set(cacheKey, JSON.stringify(classrooms), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return classrooms;
    } catch (error) {
      throw new Error(`Error fetching classrooms: ${error.message}`);
    }
  }

  async GetById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const cacheKey = `classrooms:getById:${id}`;

      // Check if data is in Redis
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData); // Return cached data
      }

      // Fetch from database if not in cache
      const classroom = await Classroom.findById(id);

      if (!classroom) {
        throw new Error("Classroom not found");
      }

      await redisClient.set(cacheKey, JSON.stringify(classroom), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return classroom;
    } catch (error) {
      throw new Error(`Error fetching classroom by ID: ${error.message}`);
    }
  }

  async Create(data) {
    try {
      const newClassroom = new Classroom({
        name: data.name,
        room_number: data.room_number,
        desc: data.desc,
        capacity: data.capacity,
      });

      const savedClassroom = await newClassroom.save();

      // Invalidate cache for GetAll
      await redisClient.del("classrooms:getAll");

      return savedClassroom;
    } catch (error) {
      throw new Error(`Error creating classroom: ${error.message}`);
    }
  }

  async Update(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const updatedClassroom = await Classroom.findByIdAndUpdate(
        id,
        {
          name: data.name,
          room_number: data.room_number,
          desc: data.desc,
          capacity: data.capacity,
        },
        { new: true, runValidators: true } // Return updated document and validate changes
      );

      if (!updatedClassroom) {
        throw new Error("Classroom not found or update failed");
      }

      // Invalidate cache for GetAll and GetById
      await redisClient.del("classrooms:getAll");
      await redisClient.del(`classrooms:getById:${id}`);

      return updatedClassroom;
    } catch (error) {
      throw new Error(`Error updating classroom: ${error.message}`);
    }
  }

  async Delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const deletedClassroom = await Classroom.findByIdAndDelete(id);

      if (!deletedClassroom) {
        throw new Error("Classroom not found or already deleted");
      }

      // Invalidate cache for GetAll and GetById
      await redisClient.del("classrooms:getAll");
      await redisClient.del(`classrooms:getById:${id}`);

      return {
        message: "Classroom successfully deleted",
        classroom: deletedClassroom,
      };
    } catch (error) {
      throw new Error(`Error deleting classroom: ${error.message}`);
    }
  }
}

module.exports = ClassroomService;
