"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const router = (0, express_1.Router)();
router.get("/", userController_1.getAllUsers); // GET all users
// Register a new user
router.post("/register", userController_1.registerUser);
// Login user
router.post("/login", userController_1.loginUser);
// Get current user (protected route)
router.get("/me", authenticationMiddleware_1.protect, userController_1.getCurrentUser);
router.get("/:id", userController_1.getUserById); // GET single user by ID
exports.default = router;
