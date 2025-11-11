import { USER_ROLES } from "../database/userDb.js";

/**
 * Check if user has required role
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "No role assigned" });
    }

    if (!req.user.isActive) {
      return res.status(403).json({ error: "Account is inactive" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

/**
 * Check if user is admin (ADMIN or SUPER_ADMIN)
 */
export function requireAdmin(req, res, next) {
  return requireRole(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN)(req, res, next);
}

/**
 * Check if user is super admin
 */
export function requireSuperAdmin(req, res, next) {
  return requireRole(USER_ROLES.SUPER_ADMIN)(req, res, next);
}

/**
 * Check if user can manage other user
 */
export function canManageUser(currentUser, targetUser) {
  // SUPER_ADMIN can manage anyone
  if (currentUser.role === USER_ROLES.SUPER_ADMIN) {
    return true;
  }

  // ADMIN can manage USER but not other ADMIN or SUPER_ADMIN
  if (currentUser.role === USER_ROLES.ADMIN) {
    return targetUser.role === USER_ROLES.USER;
  }

  return false;
}

export default {
  requireRole,
  requireAdmin,
  requireSuperAdmin,
  canManageUser,
};
