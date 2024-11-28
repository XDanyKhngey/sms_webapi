// routes/userRoutes.js
const express = require("express");
const roleController = require("../controllers/role.controller");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

// Define routes and map them to controller functions
router.get("/", verifyToken, roleController.getAll);
router.get("/:id", verifyToken, roleController.getById);

module.exports = router;
