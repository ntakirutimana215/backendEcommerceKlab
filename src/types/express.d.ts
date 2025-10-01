import { Request } from "express";
import { Document } from "mongoose";
import { IUser } from "../models/userModel";

export interface AuthRequest extends Request {
  user: IUser & Document;
}