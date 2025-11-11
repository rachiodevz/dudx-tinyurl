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
};

export default config;
