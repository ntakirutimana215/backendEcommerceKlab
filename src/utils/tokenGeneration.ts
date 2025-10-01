// utils/tokenGeneration.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Updated to accept id and role as separate parameters
export const generateAccessToken = (id: string, role: string): string => {
  return jwt.sign(
    {
      _id: id,
      role,
    },
    jwtSecret,
    { expiresIn: "7h" }
  );
};
