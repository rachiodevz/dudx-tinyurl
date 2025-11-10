import express from "express";
import Datastore from "nedb";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import fs from "fs";
import initPageRoutes from "./routes/page.js";
import initApiRoutes from "./routes/api.js";

dotenv.config({ path: ".ENV" });

// ----- logging setup -----
const LOG_FILE = "./server.log";
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(LOG_FILE, logMessage);
}

// ----- setup -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 8080;
const DB_PATH = "./urls.nedb";
let urls = []; // in-memory cache

// ----- middleware -----
app.use(express.json());

// Session setup (MUST BE BEFORE PASSPORT)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// Passport setup (MUST BE BEFORE REQUEST LOGGING)
app.use(passport.initialize());
app.use(passport.session());

// Request logging middleware (AFTER PASSPORT SO req.user IS AVAILABLE)
app.use((req, res, next) => {
  log(
    `${req.method} ${req.url} - User: ${req.user ? req.user.email : "anonymous"}`,
  );
  next();
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
      };
      return done(null, user);
    },
  ),
);

// ----- database -----
const db = new Datastore({ filename: DB_PATH, autoload: true });

// load from NeDB and start server after loading
db.loadDatabase((err) => {
  if (!err) {
    db.find({}, (err, docs) => {
      if (!err) {
        urls = docs;
        if (docs.length > 0) {
          log(`✅ Loaded ${urls.length} URLs from NeDB`);
        } else {
          log("📝 Database initialized (empty)");
        }
      } else {
        log(`❌ Error finding docs: ${err}`);
      }

      // Setup routes AFTER loading data
      setupRoutesAndStart();
    });
  } else {
    log(`❌ Error loading DB: ${err}`);
    setupRoutesAndStart();
  }
});

function setupRoutesAndStart() {
  // ----- routes -----
  // API routes (must come first to avoid conflicts)
  app.use("/api", initApiRoutes(db, urls));

  // Static files
  app.use(express.static(path.join(__dirname, "public")));

  // Page routes (includes redirect route - MUST BE LAST)
  app.use("/", initPageRoutes(urls));

  // graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down gracefully...");
    process.exit(0);
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    log(`❌ ERROR: ${err.message}`);
    log(`Stack: ${err.stack}`);
    res.status(500).json({ error: "Internal server error" });
  });

  // ----- start -----
  app.listen(PORT, () => {
    log(`🚀 TinyURL server running at http://localhost:${PORT}`);
  });
}
