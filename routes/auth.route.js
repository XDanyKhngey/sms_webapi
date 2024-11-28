// routes/userRoutes.js
const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Define routes and map them to controller functions
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);

module.exports = router;
