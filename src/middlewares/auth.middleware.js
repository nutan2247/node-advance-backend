import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";


export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Authorization token missing or malformed");
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    logger.error("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
