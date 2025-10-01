// middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {User} from "../models/userModel"; // adjust path

interface JwtPayload {
  _id: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Find user in DB
      const user = await User.findById(decoded._id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      // Attach user to request
      (req as any).user = user;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
