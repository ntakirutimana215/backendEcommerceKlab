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
exports.resetPassword = exports.requestPasswordReset = void 0;
const userModel_1 = require("../models/userModel");
const ResetPassword_1 = __importDefault(require("../models/ResetPassword"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const bcryptjs_1 = __importDefault(require("bcryptjs")); // ✅ Add this
// 🔹 Generate OTP
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Expire in 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        // Save OTP in DB
        yield ResetPassword_1.default.create({ userId: user._id, otp, expiresAt });
        // Send OTP email
        yield (0, sendEmail_1.default)(user.email, "Password Reset OTP", `<p>Hello ${user.name},</p>
       <p>Your OTP for password reset is: <b>${otp}</b></p>
       <p>This code expires in 10 minutes.</p>`);
        res.status(200).json({ message: "OTP sent to your email" });
    }
    catch (error) {
        res.status(500).json({ message: "Error generating OTP", error });
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        const user = yield userModel_1.User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const record = yield ResetPassword_1.default.findOne({
            userId: user._id,
            otp,
            expiresAt: { $gt: new Date() },
        });
        if (!record) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        // Hash and save new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        // Delete OTP
        yield ResetPassword_1.default.deleteMany({ userId: user._id });
        return res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error resetting password",
            error: error.message || error,
        });
    }
});
exports.resetPassword = resetPassword;
