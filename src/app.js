import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {errorHandler} from "./middlewares/error.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";

const app = express();


app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// app.use("/api/auth", (req, res) => {
//   res.json({ message: "Auth route is working!" });
// });
app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
