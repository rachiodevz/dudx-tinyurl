import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/index.js";
import { setupAuth } from "./middleware/auth.js";
import { requestLogger } from "./middleware/logging.js";
import { log } from "./utils/logger.js";
import initApiRoutes from "./routes/api.js";
import initPageRoutes from "./routes/page.js";
import initAdminRoutes from "./routes/admin.js";
import chatRoutes from "./routes/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(urlShortener, userDb) {
  const app = express();

  // ----- middleware -----
  app.use(express.json());

  // Session setup (MUST BE BEFORE PASSPORT)
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );

  // Passport setup (MUST BE BEFORE REQUEST LOGGING)
  setupAuth(userDb);
  app.use(passport.initialize());
  app.use(passport.session());

  // Request logging middleware (AFTER PASSPORT SO req.user IS AVAILABLE)
  app.use(requestLogger);

  // ----- routes -----
  // Admin routes (must come before other routes)
  app.use("/api/admin", initAdminRoutes(userDb));

  // Chat routes
  app.use(chatRoutes);

  // API routes
  app.use("/api", initApiRoutes(urlShortener));

  // Static files
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Page routes (includes redirect route - MUST BE LAST)
  app.use("/", initPageRoutes(urlShortener));

  // Error handling middleware
  app.use((err, req, res, next) => {
    log(`❌ ERROR: ${err.message}`);
    log(`Stack: ${err.stack}`);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

export default createApp;
