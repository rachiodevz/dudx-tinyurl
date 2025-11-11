import crypto from "crypto";

/**
 * Main business logic module
 * Add your core features and business logic here
 */

export class URLShortener {
  constructor(database) {
    this.db = database;
  }

  /**
   * Generate a unique short code
   */
  generateShortCode() {
    let code;
    let attempts = 0;
    const urls = this.db.getUrls();

    do {
      code = crypto.randomBytes(3).toString("hex");
      attempts++;
    } while (urls.find((u) => u.code === code) && attempts < 10);

    if (attempts >= 10) {
      throw new Error("Failed to generate unique code");
    }

    return code;
  }

  /**
   * Create a new short URL
   */
  createShortUrl(targetUrl, user, memo = "") {
    // Validate URL format
    try {
      new URL(targetUrl);
    } catch (e) {
      throw new Error("Invalid URL format");
    }

    const code = this.generateShortCode();
    const entry = {
      code,
      target: targetUrl,
      memo,
      clicks: 0,
      created_at: new Date(),
      created_by: {
        id: user.googleId,
        name: user.name,
        email: user.email,
      },
    };

    this.db.insert(entry);
    return entry;
  }

  /**
   * Get URL by short code
   */
  getUrlByCode(code) {
    return this.db.findByCode(code);
  }

  /**
   * Track click/visit for a URL
   */
  trackClick(code) {
    const url = this.db.findByCode(code);
    if (!url) {
      return false;
    }

    // Initialize clicks if not exists
    if (typeof url.clicks !== "number") {
      url.clicks = 0;
    }

    url.clicks += 1;
    url.last_clicked = new Date();

    this.db.update({ code }, url);
    return true;
  }

  /**
   * Get all URLs
   */
  getAllUrls() {
    return this.db.getUrls();
  }

  /**
   * Get URLs by user
   */
  getUserUrls(userId) {
    return this.db
      .getUrls()
      .filter((url) => url.created_by && url.created_by.id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  /**
   * Update URL
   */
  updateUrl(code, updates, userId) {
    const url = this.db.findByCode(code);
    if (!url) {
      throw new Error("URL not found");
    }

    // Check ownership
    if (!url.created_by || url.created_by.id !== userId) {
      throw new Error("You don't own this URL");
    }

    // Validate new code if provided
    if (updates.newCode && updates.newCode !== code) {
      if (!/^[a-zA-Z0-9]{3,20}$/.test(updates.newCode)) {
        throw new Error(
          "Invalid code format. Use 3-20 alphanumeric characters only",
        );
      }

      if (this.db.findByCode(updates.newCode)) {
        throw new Error("This code is already taken");
      }

      url.code = updates.newCode;
    }

    // Validate target URL if provided
    if (updates.target) {
      try {
        new URL(updates.target);
        url.target = updates.target;
      } catch (e) {
        throw new Error("Invalid URL format");
      }
    }

    // Update memo if provided
    if (updates.memo !== undefined) {
      url.memo = updates.memo;
    }

    url.updated_at = new Date();
    this.db.update({ code }, url);

    return url;
  }

  /**
   * Delete URL
   */
  deleteUrl(code, userId) {
    const url = this.db.findByCode(code);
    if (!url) {
      throw new Error("URL not found");
    }

    // Check ownership
    if (!url.created_by || url.created_by.id !== userId) {
      throw new Error("You don't own this URL");
    }

    this.db.remove({ code });
    return true;
  }
}

export default URLShortener;
