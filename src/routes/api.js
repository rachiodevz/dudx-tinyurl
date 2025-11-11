import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Initialize API routes
export default function initApiRoutes(urlShortener) {
  // ----- API: get all URLs (admin) -----
  router.get("/urls", requireAuth, (req, res) => {
    const urls = urlShortener.getAllUrls();
    const sortedUrls = [...urls].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
    res.json(sortedUrls);
  });

  // ----- API: get user's own URLs -----
  router.get("/my-urls", requireAuth, (req, res) => {
    const userUrls = urlShortener.getUserUrls(req.user.googleId);
    res.json(userUrls);
  });

  // ----- API: update URL -----
  router.put("/urls/:code", requireAuth, (req, res) => {
    const { code } = req.params;
    const { newCode, target, memo } = req.body;

    try {
      const updatedUrl = urlShortener.updateUrl(
        code,
        { newCode, target, memo },
        req.user.googleId,
      );
      res.json({ success: true, url: updatedUrl });
    } catch (error) {
      if (error.message === "URL not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "You don't own this URL") {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === "This code is already taken") {
        return res.status(409).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  });

  // ----- API: delete URL -----
  router.delete("/urls/:code", requireAuth, (req, res) => {
    const { code } = req.params;

    try {
      urlShortener.deleteUrl(code, req.user.googleId);
      res.json({ success: true });
    } catch (error) {
      if (error.message === "URL not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "You don't own this URL") {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  });

  // ----- API: shorten -----
  router.post("/shorten", requireAuth, (req, res) => {
    const { url, memo, customCode, expiresInDays } = req.body;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
      const entry = urlShortener.createShortUrl(
        url,
        req.user,
        memo,
        customCode,
        expiresInDays,
      );
      res.json({ short: `${req.protocol}://${req.get("host")}/${entry.code}` });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
