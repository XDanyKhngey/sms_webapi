const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const courseController = require("../controllers/course.controller");

// Routes for Course
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
