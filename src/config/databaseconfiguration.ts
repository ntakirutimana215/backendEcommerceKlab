import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const db_user=process.env.DB_USER;
const db_pass=process.env.DB_PASS;
const db_name=process.env.DB_NAME;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@cluster0.uwcnffe.mongodb.net/${db_name}`);
    console.log(" MongoDB connected successfully!!!");
  } catch (error) {
    console.error(" MongoDB connection failed", error);
    process.exit(1);
  }
};