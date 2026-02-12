import { registerUser, loginUser, refreshAccessToken } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { AppError } from "../../utils/appError.js";

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    await registerUser(data);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    // res.status(400).json({ message: err.message });
  }
};

// export const login = async (req, res) => {
//   try {
//     const data = loginSchema.parse(req.body);
//     const token = await loginUser(data);
//     res.json({ token });
//   } catch (err) {
//     res.status(401).json({ message: err.message });
//   }
// };

export const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const tokens = await loginUser(data);

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError("Refresh token required", 404);

    const newAccessToken = await refreshAccessToken(refreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    
    res.status(401).json({ message: err.message });
  }
};
