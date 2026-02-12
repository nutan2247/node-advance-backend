import jwt from "jsonwebtoken";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES_IN,
  });