import express from "express";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize page routes
export default function initPageRoutes(urlShortener) {
  // ----- authentication routes -----
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => res.redirect("/create"),
  );

  router.get("/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: "Logout failed" });
      res.redirect("/");
    });
  });

  router.get("/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      // Return user info including role for frontend
      res.json({
        googleId: req.user.googleId,
        email: req.user.email,
        name: req.user.name,
        photo: req.user.photo,
        role: req.user.role,
        isActive: req.user.isActive,
      });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // ----- page routes (without .html) -----
  router.get("/", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "..", "public", "page", "login.html"),
    );
  });

  router.get("/create", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "..", "public", "page", "create.html"),
    );
  });

  router.get("/my-urls", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "..", "public", "page", "my-urls.html"),
    );
  });

  router.get("/admin", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "..", "public", "page", "admin.html"),
    );
  });

  // ----- URL redirect (MUST BE LAST) -----
  router.get("/:code", (req, res) => {
    const url = urlShortener.getUrlByCode(req.params.code);
    if (url) {
      // Track click before redirecting
      urlShortener.trackClick(req.params.code);
      res.redirect(url.target);
    } else {
      res.status(404).send("Not found");
    }
  });

  return router;
}
