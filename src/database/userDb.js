import Datastore from "nedb";
import { log } from "../utils/logger.js";
import config from "../config/index.js";
import { saveUserAvatar } from "../utils/avatarHandler.js";

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export class UserDatabase {
  constructor() {
    this.db = new Datastore({
      filename: config.database.userPath,
      autoload: true,
    });
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db.loadDatabase((err) => {
        if (err) {
          log(`❌ Error loading User DB: ${err}`);
          reject(err);
          return;
        }
        log("✅ User database initialized");
        resolve();
      });
    });
  }

  /**
   * Find or create user from Google OAuth profile
   */
  async findOrCreateUser(profile) {
    return new Promise((resolve, reject) => {
      const googleId = profile.id;
      const email = profile.emails[0].value;

      // Find existing user
      this.db.findOne({ googleId }, (err, user) => {
        if (err) {
          reject(err);
          return;
        }

        if (user) {
          // Update last login
          user.lastLogin = new Date();

          // Try to download/update avatar
          const googlePhoto = profile.photos[0]?.value;

          saveUserAvatar(googleId, googlePhoto, profile.displayName)
            .then((localAvatar) => {
              if (localAvatar) {
                user.photo = localAvatar;
              }

              this.db.update({ googleId }, user, {}, (err) => {
                if (err) log(`❌ Error updating user: ${err}`);
              });

              resolve(user);
            })
            .catch((err) => {
              log(`⚠️  Avatar failed, using existing: ${err.message}`);

              this.db.update({ googleId }, user, {}, (err) => {
                if (err) log(`❌ Error updating user: ${err}`);
              });

              resolve(user);
            });
          return;
        }

        // Create new user - download avatar first
        const role = this.determineRole(email);
        const googlePhoto = profile.photos[0]?.value;

        // Try to save avatar (async)
        saveUserAvatar(googleId, googlePhoto, profile.displayName)
          .then((localAvatar) => {
            const newUser = {
              googleId,
              email,
              name: profile.displayName,
              photo: localAvatar || googlePhoto || null, // Use local avatar, fallback to Google URL, or null
              role,
              isActive: true,
              createdAt: new Date(),
              lastLogin: new Date(),
            };

            this.db.insert(newUser, (err, doc) => {
              if (err) {
                log(`❌ Error creating user: ${err}`);
                reject(err);
                return;
              }
              log(`✅ New user created: ${email} (${role})`);
              resolve(doc);
            });
          })
          .catch((err) => {
            // If avatar download fails, create user with Google URL or null
            log(`⚠️  Avatar download failed, using fallback: ${err.message}`);
            const newUser = {
              googleId,
              email,
              name: profile.displayName,
              photo: googlePhoto || null,
              role,
              isActive: true,
              createdAt: new Date(),
              lastLogin: new Date(),
            };

            this.db.insert(newUser, (err, doc) => {
              if (err) {
                log(`❌ Error creating user: ${err}`);
                reject(err);
                return;
              }
              log(`✅ New user created: ${email} (${role})`);
              resolve(doc);
            });
          });
      });
    });
  }

  /**
   * Determine user role based on email
   */
  determineRole(email) {
    if (config.superAdminEmails.includes(email)) {
      return USER_ROLES.SUPER_ADMIN;
    }
    return USER_ROLES.USER;
  }

  /**
   * Get user by Google ID
   */
  async getUserByGoogleId(googleId) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ googleId }, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ email }, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });
  }

  /**
   * Get all users
   */
  async getAllUsers() {
    return new Promise((resolve, reject) => {
      this.db
        .find({})
        .sort({ createdAt: -1 })
        .exec((err, users) => {
          if (err) reject(err);
          else resolve(users);
        });
    });
  }

  /**
   * Update user role
   */
  async updateUserRole(userId, newRole) {
    return new Promise((resolve, reject) => {
      // Validate role
      if (!Object.values(USER_ROLES).includes(newRole)) {
        reject(new Error("Invalid role"));
        return;
      }

      this.db.update(
        { _id: userId },
        { $set: { role: newRole, updatedAt: new Date() } },
        {},
        (err, numAffected) => {
          if (err) {
            log(`❌ Error updating user role: ${err}`);
            reject(err);
            return;
          }
          if (numAffected === 0) {
            reject(new Error("User not found"));
            return;
          }
          log(`✅ User role updated: ${userId} -> ${newRole}`);
          resolve();
        },
      );
    });
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: userId }, (err, user) => {
        if (err) {
          reject(err);
          return;
        }
        if (!user) {
          reject(new Error("User not found"));
          return;
        }

        const newStatus = !user.isActive;
        this.db.update(
          { _id: userId },
          { $set: { isActive: newStatus, updatedAt: new Date() } },
          {},
          (err) => {
            if (err) {
              log(`❌ Error toggling user status: ${err}`);
              reject(err);
              return;
            }
            log(`✅ User status toggled: ${userId} -> ${newStatus}`);
            resolve(newStatus);
          },
        );
      });
    });
  }
}

export default UserDatabase;
