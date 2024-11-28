const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const studentController = require("../controllers/student.controller");

// Routes for Student
router.get("/", verifyToken, studentController.getAllStudents);
router.get("/:id", verifyToken, studentController.getStudentById);
router.post("/", verifyToken, studentController.createStudent);
router.put("/:id", verifyToken, studentController.updateStudent);
router.delete("/:id", verifyToken, studentController.deleteStudent);

module.exports = router;
