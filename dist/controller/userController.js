"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.getUserById = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
// controllers/userController.ts
const userModel_1 = require("../models/userModel");
const tokenGeneration_1 = require("../utils/tokenGeneration");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// REGISTER
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, password, confirmpassword, role } = req.body;
        if (!fullname || !email || !password || !confirmpassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const existingUser = yield userModel_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.User({
            fullname,
            email,
            password: hashedPassword,
            userRole: role || "user",
        });
        yield newUser.save();
        // ✅ Only confirm registration, no login yet
        return res.status(201).json({
            message: "User registered successfully. Please log in.",
            redirectTo: "/login",
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res
            .status(500)
            .json({ message: "Error in user registration", error: error.message });
    }
});
exports.registerUser = registerUser;
// LOGIN
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = yield userModel_1.User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid email or password" });
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: "Invalid email or password" });
        const token = (0, tokenGeneration_1.generateAccessToken)(user._id.toString(), user.userRole);
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.userRole,
            },
            redirectTo: user.userRole === "admin" ? "/dashboard" : "/",
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Error in login", error: error.message });
    }
});
exports.loginUser = loginUser;
// GET ALL USERS
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.User.find().select("-password");
        return res.status(200).json({ users });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
// GET USER BY ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.User.findById(req.params.id).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});
exports.getUserById = getUserById;
// GET CURRENT USER
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // From auth middleware
        return res.status(200).json({
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.userRole,
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});
exports.getCurrentUser = getCurrentUser;
