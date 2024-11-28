const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const examController = require("../controllers/exam.controller");

// Routes for Exam
router.get("/", examController.getAllExams);
router.get("/:id", examController.getExamById);
router.post("/", examController.createExam);
router.put("/:id", examController.updateExam);
router.delete("/:id", examController.deleteExam);

module.exports = router;
