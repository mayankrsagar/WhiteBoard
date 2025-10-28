import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.DB || "mongodb://localhost:27017/WhiteboardDB";

export default async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    console.log("Could not connect to the database!");
  }
}
