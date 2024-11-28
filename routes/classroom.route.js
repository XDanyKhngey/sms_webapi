const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const classroomController = require("../controllers/classroom.controller");

// Routes for Classroom
router.get("/", classroomController.getAllClassrooms);
router.get("/:id", classroomController.getClassroomById);
router.post("/", classroomController.createClassroom);
router.put("/:id", classroomController.updateClassroom);
router.delete("/:id", classroomController.deleteClassroom);

module.exports = router;
