import express from "express";
import config from "../config/index.js";
import { requireAuth } from "../middleware/auth.js";
import { checkGuestLimit, getClientIp } from "../middleware/guest.js";
import QRCode from "qrcode";
import {
  generateBrandedQRCode,
  generateSimpleQRCode,
} from "../utils/qrcode-generator.js";

const router = express.Router();

// Initialize API routes
export default function initApiRoutes(urlShortener, guestDb) {
  // ----- API: get current user info -----
  router.get("/user", async (req, res) => {
    if (req.isAuthenticated()) {
      res.json({
        isAuthenticated: true,
        googleId: req.user.googleId,
        email: req.user.email,
        name: req.user.name,
        photo: req.user.photo,
        role: req.user.role,
        isActive: req.user.isActive,
      });
    } else {
      // For guests, include remaining URL count
      const guestId = req.cookies.guest_id;
      if (guestId) {
        try {
          const limitCheck = await guestDb.checkLimit(
            guestId,
            config.guestCreateUrlDailyLimit,
          );
          res.json({
            isAuthenticated: false,
            guestInfo: {
              remaining: limitCheck.remaining,
              limit: limitCheck.limit,
            },
          });
        } catch (error) {
          res.json({ isAuthenticated: false });
        }
      } else {
        res.json({ isAuthenticated: false });
      }
    }
  });

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
  // Apply guest limit check (skips if authenticated)
  router.post(
    "/shorten",
    checkGuestLimit(guestDb, config.guestCreateUrlDailyLimit),
    async (req, res) => {
      const { url, memo, customCode, expiresInDays } = req.body;
      if (!url) return res.status(400).json({ error: "Missing URL" });

      try {
        const isAuthenticated = req.isAuthenticated();

        // Guest users cannot use custom codes
        if (!isAuthenticated && customCode) {
          return res.status(403).json({
            error: "Custom codes are only available for registered users",
            requiresLogin: true,
          });
        }

        // Create short URL
        // Guest users: auto-expire in 90 days, no memo
        const finalExpiryDays = isAuthenticated ? expiresInDays : 90;
        const finalMemo = isAuthenticated ? memo : "";

        const entry = urlShortener.createShortUrl(
          url,
          isAuthenticated ? req.user : null,
          finalMemo,
          isAuthenticated ? customCode : null,
          finalExpiryDays,
        );

        // Record guest usage if not authenticated
        if (!isAuthenticated) {
          try {
            await guestDb.incrementUsage(req.guestId, entry.code);
          } catch (err) {
            console.error("Failed to record guest usage:", err);
          }
        }

        // Generate QR code with DUDX branding
        const shortUrl = `${req.protocol}://${req.get("host")}/${entry.code}`;
        let qrCode;

        try {
          qrCode = await generateBrandedQRCode(shortUrl, {
            size: 400,
            logoText: "DUDX",
            includeUrl: true,
          });
        } catch (error) {
          console.error("Branded QR failed, using simple:", error);
          qrCode = await generateSimpleQRCode(shortUrl, 300);
        }

        // Return response with QR code and remaining limit info for guests
        const response = {
          short: shortUrl,
          code: entry.code,
          target: entry.target,
          qrCode: qrCode,
        };

        if (!isAuthenticated && req.guestLimit) {
          response.guestInfo = {
            remaining: req.guestLimit.remaining - 1,
            limit: req.guestLimit.limit,
          };
        }

        res.json(response);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  );

  // ----- API: generate QR code -----
  router.get("/qr/:code", requireAuth, async (req, res) => {
    const { code } = req.params;
    const url = urlShortener.getUrlByCode(code);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Check ownership
    if (!url.created_by || url.created_by.id !== req.user.googleId) {
      return res.status(403).json({ error: "You don't own this URL" });
    }

    try {
      const shortUrl = `${req.protocol}://${req.get("host")}/${code}`;
      const qrCodeDataURL = await QRCode.toDataURL(shortUrl, {
        width: 300,
        margin: 2,
      });
      res.json({ qrCode: qrCodeDataURL });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  });

  // ----- API: get link data by code -----
  router.get("/link/:code", async (req, res) => {
    const { code } = req.params;
    const url = urlShortener.getUrlByCode(code);

    if (!url) {
      return res.status(404).json({ error: "Link not found" });
    }

    try {
      // Generate QR code for this link
      const shortUrl = `${req.protocol}://${req.get("host")}/${code}`;
      let qrCode;

      try {
        qrCode = await generateBrandedQRCode(shortUrl, {
          size: 400,
          logoText: "DUDX",
          includeUrl: true,
        });
      } catch (error) {
        console.error("Branded QR failed, using simple:", error);
        qrCode = await generateSimpleQRCode(shortUrl, 300);
      }

      // Return link data with QR code
      res.json({
        code: url.code,
        target: url.target,
        memo: url.memo,
        clicks: url.clicks,
        created_at: url.created_at,
        expires_at: url.expires_at,
        qrCode: qrCode,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to load link data" });
    }
  });

  return router;
}
