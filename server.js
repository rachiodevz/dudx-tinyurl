import express from "express";
import Datastore from "nedb";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config({ path: ".ENV" });

// ----- setup -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 8080;
const DB_PATH = "./urls.nedb";
let urls = []; // in-memory cache

// ----- middleware -----
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { id: profile.id, name: profile.displayName });
    },
  ),
);
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
const db = new Datastore({ filename: DB_PATH, autoload: false });

// load from NeDB if exists
if (fs.existsSync(DB_PATH)) {
  console.log("🗂️ Loading database...");
  db.loadDatabase((err) => {
    if (!err) {
      db.find({}, (err, docs) => {
        if (!err) {
          urls = docs;
          console.log(`✅ Loaded ${urls.length} URLs from NeDB`);
        }
      });
    } else {
      console.error("❌ Error loading DB:", err);
    }
  });
} else {
  console.log("⚠️ No DB file found, running with memory cache only.");
}

// ----- authentication routes -----
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/"),
);

app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.redirect("/");
  });
});

app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// ----- middleware: check auth -----
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
};

// ----- API: shorten -----
app.post("/shorten", requireAuth, (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  // validate URL format
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  // generate short code (check for collisions)
  let code;
  let attempts = 0;
  do {
    code = crypto.randomBytes(3).toString("hex");
    attempts++;
  } while (urls.find((u) => u.code === code) && attempts < 10);

  if (attempts >= 10) {
    return res.status(500).json({ error: "Failed to generate unique code" });
  }

  const entry = { code, target: url, created_at: new Date() };
  urls.push(entry);

  // save to database immediately
  db.insert(entry, (err) => {
    if (err) console.error("❌ DB insert error:", err);
  });

  res.json({ short: `${req.protocol}://${req.get("host")}/${code}` });
});

// ----- periodic save -----
setInterval(() => {
  if (urls.length === 0) return;
  db.remove({}, { multi: true }, () => {
    db.insert(urls, (err) => {
      if (err) console.error("❌ DB save error:", err);
      else console.log(`💾 Saved ${urls.length} records to NeDB`);
    });
  });
}, 10000); // save every 10s

// graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down, saving DB...");
  db.remove({}, { multi: true }, () => {
    db.insert(urls, () => process.exit(0));
  });
});

// ----- static files -----
app.use(express.static(path.join(__dirname, "public")));

// ----- API: redirect (MUST BE LAST) -----
app.get("/:code", (req, res) => {
  const found = urls.find((u) => u.code === req.params.code);
  if (found) res.redirect(found.target);
  else res.status(404).send("Not found");
});

// ----- start -----
app.listen(PORT, () => {
  console.log(`🚀 TinyURL server running at http://localhost:${PORT}`);
});
