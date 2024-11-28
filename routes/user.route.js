// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/auth.middleware");
const router = express.Router();

// Define routes and map them to controller functions
router.get("/", verifyToken, userController.getUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.post("/", verifyToken, userController.createUser);
router.patch("/changePassword/:id", verifyToken, userController.changePassword);

module.exports = router;
