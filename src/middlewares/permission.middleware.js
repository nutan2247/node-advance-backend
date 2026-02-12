import { ROLE_PERMISSIONS } from "../constants/rolePermissions.js";

export const authorizePermission = (requiredPermission) => {
  return (req, res, next) => {
    const role = req.user.role;

    const permissions = ROLE_PERMISSIONS[role] || [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    next();
  };
};
