import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPasswordReset extends Document {
  userId: Types.ObjectId;
  otp: string;
  expiresAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const PasswordReset = mongoose.model<IPasswordReset>("PasswordReset", passwordResetSchema);

export default PasswordReset;