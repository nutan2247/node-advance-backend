import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { getAllUsers } from "./admin.controller.js";

const router = express.Router();

// to fetch all users - only accessible by admin
router.get(
  "/users",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  getAllUsers
);

// to create a new user by admin
router.post(
  "/users",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  createUserByAdmin
);

// to update user role - only accessible by admin
router.patch(
  "/users/:id/role",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  updateUserRole
);




export default router;



