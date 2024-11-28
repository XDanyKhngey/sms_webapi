const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const teacherController = require("../controllers/teacher.controller");

// Routes for Teacher
router.get("/", verifyToken, teacherController.getAllTeachers);
router.get("/:id", verifyToken, teacherController.getTeacherById);
router.post("/", verifyToken, teacherController.createTeacher);
router.put("/:id", verifyToken, teacherController.updateTeacher);
router.delete("/:id", verifyToken, teacherController.deleteTeacher);

module.exports = router;
