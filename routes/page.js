import express from "express";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize page routes
export default function initPageRoutes(urls) {
  // ----- authentication routes -----
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => res.redirect("/"),
  );

  router.get("/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: "Logout failed" });
      res.redirect("/");
    });
  });

  router.get("/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // ----- page routes (without .html) -----
  router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });

  router.get("/my-urls", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "my-urls.html"));
  });

  router.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
  });

  // ----- URL redirect (MUST BE LAST) -----
  router.get("/:code", (req, res) => {
    const found = urls.find((u) => u.code === req.params.code);
    if (found) res.redirect(found.target);
    else res.status(404).send("Not found");
  });

  return router;
}
