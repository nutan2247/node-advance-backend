import { Router } from "express";
import { register, login, refreshToken } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize , authorizeRoles} from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { getAllUsers } from "../admin/admin.controller.js";
import { PERMISSIONS } from "../../constants/permissions.js";
import { authorizePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/refresh-token", refreshToken);

// Protected routes (examples)
router.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "User profile accessed",
    user: req.user,
  });
});

router.get(
  "/admin-dashboard",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

router.get(
  "/manager-dashboard",
  authenticate,
  authorize("admin", "manager"),
  (req, res) => {
    res.json({ message: "Welcome Manager" });
  }
);

router.get(
  "/manager/users",
  authenticate,
  // authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  authorizePermission(PERMISSIONS.USER_VIEW),
  getAllUsers
);

export default router;
