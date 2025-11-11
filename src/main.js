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
  createShortUrl(
    targetUrl,
    user,
    memo = "",
    customCode = null,
    expiresInDays = null,
  ) {
    // Validate URL format
    try {
      new URL(targetUrl);
    } catch (e) {
      throw new Error("Invalid URL format");
    }

    let code;

    // If custom code is provided, validate and use it
    if (customCode) {
      // Validate custom code format (3-20 alphanumeric characters)
      if (!/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
        throw new Error(
          "Custom code must be 3-20 alphanumeric characters only",
        );
      }

      // Check if code is already taken
      if (this.db.findByCode(customCode)) {
        throw new Error("This code is already taken");
      }

      code = customCode;
    } else {
      // Generate random code
      code = this.generateShortCode();
    }

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

    // Add expiration date if specified
    if (expiresInDays && expiresInDays > 0) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(expiresInDays));
      entry.expires_at = expiryDate;
    }

    this.db.insert(entry);
    return entry;
  }

  /**
   * Get URL by short code
   */
  getUrlByCode(code) {
    const url = this.db.findByCode(code);

    // Check if URL is expired
    if (url && url.expires_at) {
      const now = new Date();
      const expiryDate = new Date(url.expires_at);
      if (now > expiryDate) {
        return null; // URL has expired
      }
    }

    return url;
  }

  /**
   * Check if URL is expired
   */
  isExpired(code) {
    const url = this.db.findByCode(code);
    if (!url || !url.expires_at) {
      return false;
    }

    const now = new Date();
    const expiryDate = new Date(url.expires_at);
    return now > expiryDate;
  }

  /**
   * Track click/visit for a URL
   */
  trackClick(code) {
    const url = this.db.findByCode(code);
    if (!url) {
      console.log(`[trackClick] URL not found: ${code}`);
      return false;
    }

    // Initialize clicks if not exists
    if (typeof url.clicks !== "number") {
      url.clicks = 0;
    }

    url.clicks += 1;
    url.last_clicked = new Date();

    console.log(`[trackClick] Updating ${code}: clicks=${url.clicks}`);
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
