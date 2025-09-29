import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/schoolDB";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;