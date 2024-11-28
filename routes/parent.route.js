const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const parentController = require("../controllers/parent.controller");

// Routes for Parent
router.get("/", verifyToken, parentController.getAllParents);
router.get("/:id", verifyToken, parentController.getParentById);
router.post("/", verifyToken, parentController.createParent);
router.put("/:id", verifyToken, parentController.updateParent);
router.delete("/:id", verifyToken, parentController.deleteParent);

module.exports = router;
