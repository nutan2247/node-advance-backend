import bcrypt from "bcrypt"; 
import User from "../../models/user.model.js";
import { ROLES } from "../../constants/roles.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Audit from "../../models/audit.model.js";



export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;

  const users = await User.find()
    .select("-password -refreshToken")
    .skip((page - 1) * limit)
    .limit(limit);

  res.json(users);
});



// export const createUserByAdmin = async (req, res) => {
export const createUserByAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
  // this will create a log 
  await Audit.create({
    action: "USER_CREATED",
    performedBy: req.user.userId,
    targetUser: user._id,
  });


  res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});


export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "Role updated", user });
};

export const disableUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: "User disabled" });
};