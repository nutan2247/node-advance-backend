import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // VERY IMPORTANT (security)
    },

    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: { 
        type: String, 
        select: false 
    }
  },
  
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
