import { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  
  accessToken?: string;
  userRole: string;
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // ✅ email is unique
    password: { type: String, required: true },
    accessToken: { type: String },
    userRole: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", userSchema);
