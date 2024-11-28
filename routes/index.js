// index.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const userRoutes = require("./user.route");
const roleRoutes = require("./role.route");
const authRoutes = require("./auth.route");

const studentRoutes = require("./student.route");
const teacherRoutes = require("./teacher.route");
const courseRoutes = require("./course.route");
const classroomRoutes = require("./classroom.route");
const examRoutes = require("./exam.route");
const parentRoutes = require("./parent.route");

// Mount routes
router.use("/auth", authRoutes);
router.use("/user", verifyToken, userRoutes);
router.use("/role", verifyToken, roleRoutes);

router.use("/student", studentRoutes);
router.use("/teacher", teacherRoutes);
router.use("/course", courseRoutes);
router.use("/classroom", classroomRoutes);
router.use("/exam", examRoutes);
router.use("/parent", parentRoutes);

// Mount all routes
module.exports = router;
