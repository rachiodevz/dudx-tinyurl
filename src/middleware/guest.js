/**
 * Guest User Middleware
 * Handles guest identification, tracking, and rate limiting
 */

import { v4 as uuidv4 } from 'uuid';

const GUEST_COOKIE_NAME = 'guest_id';
const GUEST_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1 year

/**
 * Ensure guest has a UUID cookie for tracking
 */
export function ensureGuestId(req, res, next) {
  let guestId = req.cookies[GUEST_COOKIE_NAME];

  if (!guestId) {
    // Generate new guest ID
    guestId = uuidv4();
    res.cookie(GUEST_COOKIE_NAME, guestId, {
      maxAge: GUEST_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  // Attach to request
  req.guestId = guestId;
  req.isGuest = !req.isAuthenticated();

  next();
}

/**
 * Get client IP address (handles proxy/load balancer)
 */
export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

/**
 * Check guest usage limit middleware
 * Only applies to non-authenticated users
 */
export function checkGuestLimit(guestDb, limit = 3) {
  return async (req, res, next) => {
    // Skip if user is authenticated
    if (req.isAuthenticated()) {
      return next();
    }

    try {
      const guestId = req.guestId;
      const ipAddress = getClientIp(req);

      // Ensure guest record exists
      await guestDb.getOrCreateGuestUsage(guestId, ipAddress);

      // Check limit
      const limitCheck = await guestDb.checkLimit(guestId, limit);

      // Attach to request for later use
      req.guestLimit = limitCheck;

      if (!limitCheck.canCreate) {
        return res.status(429).json({
          error: 'Daily limit exceeded',
          message: `You have reached the limit of ${limit} URLs per day for guest users. Please sign up to create unlimited URLs!`,
          limit: limitCheck.limit,
          usageCount: limitCheck.usageCount,
          remaining: 0,
        });
      }

      next();
    } catch (error) {
      console.error('Guest limit check error:', error);
      // Allow request to proceed on error (fail open)
      next();
    }
  };
}

/**
 * Record guest URL creation
 */
export function recordGuestUsage(guestDb) {
  return async (req, res, next) => {
    // Skip if user is authenticated
    if (req.isAuthenticated()) {
      return next();
    }

    try {
      const guestId = req.guestId;
      const urlCode = req.createdUrlCode; // Set by route handler

      if (urlCode) {
        await guestDb.incrementUsage(guestId, urlCode);
      }

      next();
    } catch (error) {
      console.error('Guest usage recording error:', error);
      // Continue anyway
      next();
    }
  };
}

export default {
  ensureGuestId,
  getClientIp,
  checkGuestLimit,
  recordGuestUsage,
};
