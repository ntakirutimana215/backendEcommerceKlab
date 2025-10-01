import { Request, Response } from "express";
import {User} from "../models/userModel";
import PasswordReset from "../models/ResetPassword";
import mailerSender from "../utils/sendEmail";
import bcrypt from "bcryptjs";  // ✅ Add this
import crypto from "crypto";

// 🔹 Generate OTP
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP in DB
    await PasswordReset.create({ userId: user._id, otp, expiresAt });

    // Send OTP email
    await mailerSender(
      user.email,
      "Password Reset OTP",
      `<p>Hello ${user.name},</p>
       <p>Your OTP for password reset is: <b>${otp}</b></p>
       <p>This code expires in 10 minutes.</p>`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error generating OTP", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const record = await PasswordReset.findOne({
      userId: user._id,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP
    await PasswordReset.deleteMany({ userId: user._id });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error resetting password",
      error: error.message || error,
    });
  }
};