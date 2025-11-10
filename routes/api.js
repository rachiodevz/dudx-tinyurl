import express from "express";
import crypto from "crypto";

const router = express.Router();

// Middleware: check authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
};

// Initialize API routes
export default function initApiRoutes(db, urls) {
  // ----- API: get all URLs (admin) -----
  router.get("/urls", requireAuth, (req, res) => {
    // Return URLs sorted by creation date (newest first)
    const sortedUrls = [...urls].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
    res.json(sortedUrls);
  });

  // ----- API: get user's own URLs -----
  router.get("/my-urls", requireAuth, (req, res) => {
    console.log("🔍 User ID:", req.user.id);
    console.log("📋 Total URLs:", urls.length);
    console.log(
      "📋 URLs with created_by:",
      urls.filter((u) => u.created_by).length,
    );

    const userUrls = urls
      .filter((url) => {
        const match = url.created_by && url.created_by.id === req.user.id;
        if (url.created_by) {
          console.log(
            `  URL ${url.code}: created_by.id=${url.created_by.id}, match=${match}`,
          );
        }
        return match;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    console.log("✅ User URLs found:", userUrls.length);
    res.json(userUrls);
  });

  // ----- API: update URL -----
  router.put("/urls/:code", requireAuth, (req, res) => {
    const { code } = req.params;
    const { newCode, target, memo } = req.body;

    // Find the URL
    const urlIndex = urls.findIndex((u) => u.code === code);
    if (urlIndex === -1) {
      return res.status(404).json({ error: "URL not found" });
    }

    const url = urls[urlIndex];

    // Check ownership
    if (!url.created_by || url.created_by.id !== req.user.id) {
      return res.status(403).json({ error: "You don't own this URL" });
    }

    // Validate new code if provided
    if (newCode && newCode !== code) {
      // Check code format (alphanumeric, 3-20 chars)
      if (!/^[a-zA-Z0-9]{3,20}$/.test(newCode)) {
        return res.status(400).json({
          error: "Invalid code format. Use 3-20 alphanumeric characters only",
        });
      }

      // Check if new code already exists
      if (urls.some((u) => u.code === newCode)) {
        return res.status(409).json({ error: "This code is already taken" });
      }

      url.code = newCode;
    }

    // Validate target URL if provided
    if (target) {
      try {
        new URL(target);
        url.target = target;
      } catch (e) {
        return res.status(400).json({ error: "Invalid URL format" });
      }
    }

    // Update memo if provided (allow empty string to clear memo)
    if (memo !== undefined) {
      url.memo = memo;
    }

    url.updated_at = new Date();
    urls[urlIndex] = url;

    // Update database
    db.update({ code }, url, {}, (err) => {
      if (err) console.error("❌ DB update error:", err);
    });

    res.json({ success: true, url });
  });

  // ----- API: delete URL -----
  router.delete("/urls/:code", requireAuth, (req, res) => {
    const { code } = req.params;

    // Find the URL
    const urlIndex = urls.findIndex((u) => u.code === code);
    if (urlIndex === -1) {
      return res.status(404).json({ error: "URL not found" });
    }

    const url = urls[urlIndex];

    // Check ownership
    if (!url.created_by || url.created_by.id !== req.user.id) {
      return res.status(403).json({ error: "You don't own this URL" });
    }

    // Remove from memory
    urls.splice(urlIndex, 1);

    // Remove from database
    db.remove({ code }, {}, (err) => {
      if (err) console.error("❌ DB delete error:", err);
    });

    res.json({ success: true });
  });

  // ----- API: shorten -----
  router.post("/shorten", requireAuth, (req, res) => {
    const { url, memo } = req.body;
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

    const entry = {
      code,
      target: url,
      memo: memo || "",
      created_at: new Date(),
      created_by: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    };
    urls.push(entry);

    // save to database immediately
    db.insert(entry, (err) => {
      if (err) console.error("❌ DB insert error:", err);
    });

    res.json({ short: `${req.protocol}://${req.get("host")}/${code}` });
  });

  return router;
}
