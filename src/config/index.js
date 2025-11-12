import dotenv from "dotenv";

dotenv.config({ path: ".ENV" });

export const config = {
  port: process.env.PORT || 8080,
  baseUrl: process.env.BASE_URL || "http://localhost:8080",
  sessionSecret: process.env.SESSION_SECRET || "your-secret-key",
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  database: {
    path: "./data/urls.nedb",
    userPath: "./data/users.nedb",
  },
  superAdminEmails: (process.env.SUPER_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e),

  // Runtime configurable settings (can be updated via admin panel later)
  sessionMaxAgeHours: parseInt(process.env.SESSION_MAX_AGE_HOURS || "168", 10), // 168 hours = 7 days
  guestCreateUrlDailyLimit: parseInt(
    process.env.GUEST_CREATE_URL_DAILY_LIMIT || "3",
    10,
  ),

  // Method to update config at runtime
  updateConfig(key, value) {
    if (this.hasOwnProperty(key)) {
      this[key] = value;
      return true;
    }
    return false;
  },

  // Computed getters for derived values (convert hours to milliseconds)
  get sessionMaxAge() {
    return this.sessionMaxAgeHours * 60 * 60 * 1000;
  },
};

export default config;
