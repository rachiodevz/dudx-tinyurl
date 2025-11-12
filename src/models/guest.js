/**
 * Guest Usage Tracking Model
 * Tracks anonymous users' URL creation to enforce daily limits
 */

import Datastore from 'nedb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GuestDatabase {
  constructor(dbPath = null) {
    const defaultPath = path.join(__dirname, '..', '..', 'data', 'guests.nedb');
    this.db = new Datastore({
      filename: dbPath || defaultPath,
      autoload: true,
    });

    // Create indexes
    this.db.ensureIndex({ fieldName: 'guestId' });
    this.db.ensureIndex({ fieldName: 'ipAddress' });
    this.db.ensureIndex({ fieldName: 'usageDate' });
  }

  /**
   * Initialize database
   */
  async initialize() {
    return new Promise((resolve) => {
      this.db.loadDatabase((err) => {
        if (err) {
          console.error('Failed to load guest database:', err);
        }
        resolve();
      });
    });
  }

  /**
   * Get or create guest record for today
   * @param {string} guestId - Guest UUID from cookie
   * @param {string} ipAddress - Guest IP address
   * @returns {Promise<Object>} Guest record
   */
  async getOrCreateGuestUsage(guestId, ipAddress) {
    return new Promise((resolve, reject) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find today's record
      this.db.findOne(
        {
          guestId: guestId,
          usageDate: { $gte: today },
        },
        (err, record) => {
          if (err) return reject(err);

          if (record) {
            // Update IP if changed
            if (record.ipAddress !== ipAddress) {
              this.db.update(
                { _id: record._id },
                { $set: { ipAddress } },
                {},
                (updateErr) => {
                  if (updateErr) console.error('Failed to update IP:', updateErr);
                }
              );
            }
            return resolve(record);
          }

          // Create new record for today
          const newRecord = {
            guestId: guestId,
            ipAddress: ipAddress,
            usageDate: today,
            usageCount: 0,
            createdUrls: [],
            createdAt: new Date(),
          };

          this.db.insert(newRecord, (insertErr, doc) => {
            if (insertErr) return reject(insertErr);
            resolve(doc);
          });
        }
      );
    });
  }

  /**
   * Check if guest has exceeded daily limit
   * @param {string} guestId - Guest UUID
   * @param {number} limit - Maximum URLs per day (default: 3)
   * @returns {Promise<Object>} { canCreate: boolean, remaining: number, usageCount: number }
   */
  async checkLimit(guestId, limit = 3) {
    return new Promise((resolve, reject) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.db.findOne(
        {
          guestId: guestId,
          usageDate: { $gte: today },
        },
        (err, record) => {
          if (err) return reject(err);

          const usageCount = record ? record.usageCount : 0;
          const canCreate = usageCount < limit;
          const remaining = Math.max(0, limit - usageCount);

          resolve({
            canCreate,
            remaining,
            usageCount,
            limit,
          });
        }
      );
    });
  }

  /**
   * Increment usage count and add URL to guest's created URLs
   * @param {string} guestId - Guest UUID
   * @param {string} urlCode - Short URL code
   * @returns {Promise<Object>} Updated record
   */
  async incrementUsage(guestId, urlCode) {
    return new Promise((resolve, reject) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.db.update(
        {
          guestId: guestId,
          usageDate: { $gte: today },
        },
        {
          $inc: { usageCount: 1 },
          $push: { createdUrls: urlCode },
          $set: { lastUsedAt: new Date() },
        },
        { returnUpdatedDocs: true },
        (err, numAffected, doc) => {
          if (err) return reject(err);
          resolve(doc);
        }
      );
    });
  }

  /**
   * Get guest usage statistics
   * @param {string} guestId - Guest UUID
   * @returns {Promise<Object>} Usage stats
   */
  async getGuestStats(guestId) {
    return new Promise((resolve, reject) => {
      this.db.find({ guestId: guestId })
        .sort({ usageDate: -1 })
        .exec((err, records) => {
          if (err) return reject(err);

          const totalUrls = records.reduce((sum, r) => sum + r.usageCount, 0);
          const totalDays = records.length;

          resolve({
            totalUrls,
            totalDays,
            records,
          });
        });
    });
  }

  /**
   * Clean up old guest records (older than 30 days)
   * @returns {Promise<number>} Number of removed records
   */
  async cleanupOldRecords() {
    return new Promise((resolve, reject) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      this.db.remove(
        { usageDate: { $lt: thirtyDaysAgo } },
        { multi: true },
        (err, numRemoved) => {
          if (err) return reject(err);
          resolve(numRemoved);
        }
      );
    });
  }
}

export default GuestDatabase;
