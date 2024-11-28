const mongoose = require("mongoose");
const Exam = require("../models/exam");
const redisClient = require("../utils/redis.util"); // Import the Redis utility

class ExamService {
  async GetAll() {
    try {
      const cacheKey = "exam:getAll";
      // Check if data is in Redis
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData); // Return cached data
      }

      const exam = await Exam.find({}).populate("course");

      await redisClient.set(cacheKey, JSON.stringify(exam), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return exam;
    } catch (error) {
      throw new Error(`Error fetching exams: ${error.message}`);
    }
  }

  async GetById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const cacheKey = `exam:getById:${id}`;
      // Check if data is in Redis
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData); // Return cached data
      }

      const exam = await Exam.findById(id).populate("course");

      if (!exam) {
        throw new Error("Exam not found");
      }

      await redisClient.set(cacheKey, JSON.stringify(exam), {
        EX: 60 * process.env.REDIS_CACHE_EX_MIN || 5,
      });

      return exam;
    } catch (error) {
      throw new Error(`Error fetching exam by ID: ${error.message}`);
    }
  }

  async Create(data) {
    try {
      const newExam = new Exam({
        course: data.courseId,
        exam_name: data.exam_name,
        exam_date: data.exam_date,
        total_marks: data.total_marks,
        desc: data.desc,
      });

      const exam = await newExam.save();

      await redisClient.del("exam:getAll");

      return exam;
    } catch (error) {
      throw new Error(`Error creating exam: ${error.message}`);
    }
  }

  async Update(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const updatedExam = await Exam.findByIdAndUpdate(
        id,
        {
          course: data.course_id,
          exam_name: data.exam_name,
          exam_date: data.exam_date,
          total_marks: data.total_marks,
          desc: data.desc,
        },
        { new: true, runValidators: true } // Return updated document and validate changes
      );

      if (!updatedExam) {
        throw new Error("Exam not found or update failed");
      }

      await redisClient.del("exam:getAll");
      await redisClient.del(`exam:getById:${id}`);

      return updatedExam;
    } catch (error) {
      throw new Error(`Error updating exam: ${error.message}`);
    }
  }

  async Delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      const deletedExam = await Exam.findByIdAndDelete(id);

      if (!deletedExam) {
        throw new Error("Exam not found or already deleted");
      }

      await redisClient.del("exam:getAll");
      await redisClient.del(`exam:getById:${id}`);

      return { message: "Exam successfully deleted", exam: deletedExam };
    } catch (error) {
      throw new Error(`Error deleting exam: ${error.message}`);
    }
  }
}

module.exports = ExamService;
