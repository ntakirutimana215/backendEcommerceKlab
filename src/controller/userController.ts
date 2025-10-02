// controllers/userController.ts
import { User } from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import { generateAccessToken } from "../utils/tokenGeneration";
import bcryptjs from "bcryptjs";

// REGISTER
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullname, email, password, confirmpassword, role } = req.body;

    if (!fullname || !email || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields are required, please fill them" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      
      userRole: role || "user",
    });

    await newUser.save();

    // ✅ Only confirm registration, no login yet
    return res.status(201).json({
      message: "User registered successfully. Please log in.",
      redirectTo: "/login",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "Error in user registration", error: error.message });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateAccessToken(user._id.toString(), user.userRole);

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
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error in login", error: error.message });
  }
};

// GET ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ users });
  } catch (error: any) {
    return res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// GET USER BY ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req: any, res: Response) => {
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
  } catch (error: any) {
    return res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};