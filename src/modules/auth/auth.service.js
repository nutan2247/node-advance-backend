import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";

export const registerUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("User already exists");

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return user;
};

// export const loginUser = async (data) => {
//   const user = await User.findOne({ email: data.email }).select("+password");
//   if (!user) throw new Error("Invalid credentials");

//   const isMatch = await comparePassword(data.password, user.password);
//   if (!isMatch) throw new Error("Invalid credentials");

//   const token = signAccessToken({
//     userId: user._id,
//     role: user.role,
//   });

//   return token;
// };

export const loginUser = async (data) => {
  const user = await User.findOne({ email: data.email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const payload = {
    userId: user._id,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshToken = await hashPassword(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (token) => {
  const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

  const user = await User.findById(decoded.userId).select("+refreshToken");
  if (!user) throw new Error("User not found");

  const isValid = await comparePassword(token, user.refreshToken);
  if (!isValid) throw new Error("Invalid refresh token");

  return signAccessToken({
    userId: user._id,
    role: user.role,
  });
};
