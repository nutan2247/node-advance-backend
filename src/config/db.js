import mongoose from "mongoose";
import { logger } from "../utils/logger.js";


export const connectDB = async () => {
    // console.log(process.env.MONGO_URI); return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected with nutankumar123042_db_user");
  } catch (error) {
    logger.error("DB connection failed", error);
    process.exit(1);
  }
};
