import express from "express";
import { requireAdmin, requireSuperAdmin, canManageUser } from "../middleware/rbac.js";
import { USER_ROLES } from "../database/userDb.js";

const router = express.Router();

export default function initAdminRoutes(userDb) {
  // ----- Get all users (ADMIN & SUPER_ADMIN) -----
  router.get("/users", requireAdmin, async (req, res) => {
    try {
      const users = await userDb.getAllUsers();
      // Don't send sensitive data
      const sanitizedUsers = users.map((u) => ({
        _id: u._id,
        googleId: u.googleId,
        email: u.email,
        name: u.name,
        photo: u.photo,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
      }));
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ----- Update user role (ADMIN & SUPER_ADMIN) -----
  router.put("/users/:userId/role", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      // Validate role
      if (!Object.values(USER_ROLES).includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      // Get target user
      const targetUser = await userDb.getUserByGoogleId(userId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if current user can manage target user
      if (!canManageUser(req.user, targetUser)) {
        return res.status(403).json({
          error: "You don't have permission to change this user's role",
        });
      }

      // ADMIN cannot promote to ADMIN or SUPER_ADMIN
      if (
        req.user.role === USER_ROLES.ADMIN &&
        (role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN)
      ) {
        return res.status(403).json({
          error: "You cannot promote users to ADMIN or SUPER_ADMIN",
        });
      }

      await userDb.updateUserRole(targetUser._id, role);
      res.json({ success: true, message: "User role updated" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ----- Toggle user active status (ADMIN & SUPER_ADMIN) -----
  router.put("/users/:userId/toggle-status", requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;

      // Get target user
      const targetUser = await userDb.getUserByGoogleId(userId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Cannot deactivate yourself
      if (targetUser.googleId === req.user.googleId) {
        return res.status(400).json({ error: "Cannot deactivate your own account" });
      }

      // Check if current user can manage target user
      if (!canManageUser(req.user, targetUser)) {
        return res.status(403).json({
          error: "You don't have permission to manage this user",
        });
      }

      const newStatus = await userDb.toggleUserStatus(targetUser._id);
      res.json({
        success: true,
        message: `User ${newStatus ? "activated" : "deactivated"}`,
        isActive: newStatus,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ----- Get user statistics (SUPER_ADMIN only) -----
  router.get("/stats", requireSuperAdmin, async (req, res) => {
    try {
      const users = await userDb.getAllUsers();
      const stats = {
        total: users.length,
        active: users.filter((u) => u.isActive).length,
        inactive: users.filter((u) => !u.isActive).length,
        byRole: {
          [USER_ROLES.USER]: users.filter((u) => u.role === USER_ROLES.USER).length,
          [USER_ROLES.ADMIN]: users.filter((u) => u.role === USER_ROLES.ADMIN).length,
          [USER_ROLES.SUPER_ADMIN]: users.filter(
            (u) => u.role === USER_ROLES.SUPER_ADMIN,
          ).length,
        },
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
