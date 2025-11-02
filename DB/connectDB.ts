import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI as string);
  } catch (error) {
    console.error("DB Connection Error:", error);
    throw new Error("Database connection failed");
  }
};

export default connectDB;
