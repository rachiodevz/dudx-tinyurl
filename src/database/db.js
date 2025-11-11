import Datastore from "nedb";
import { log } from "../utils/logger.js";
import config from "../config/index.js";

export class Database {
  constructor() {
    this.db = new Datastore({ filename: config.database.path, autoload: true });
    this.urls = []; // in-memory cache
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db.loadDatabase((err) => {
        if (err) {
          log(`❌ Error loading DB: ${err}`);
          reject(err);
          return;
        }

        this.db.find({}, (err, docs) => {
          if (err) {
            log(`❌ Error finding docs: ${err}`);
            reject(err);
            return;
          }

          this.urls = docs;
          if (docs.length > 0) {
            log(`✅ Loaded ${this.urls.length} URLs from NeDB`);
          } else {
            log("📝 Database initialized (empty)");
          }
          resolve();
        });
      });
    });
  }

  getUrls() {
    return this.urls;
  }

  getDb() {
    return this.db;
  }

  findByCode(code) {
    return this.urls.find((u) => u.code === code);
  }

  insert(entry) {
    this.urls.push(entry);
    this.db.insert(entry, (err) => {
      if (err) log(`❌ DB insert error: ${err}`);
    });
  }

  update(query, update) {
    const index = this.urls.findIndex((u) => u.code === query.code);
    if (index !== -1) {
      this.urls[index] = update;
    }
    this.db.update(query, update, {}, (err) => {
      if (err) log(`❌ DB update error: ${err}`);
    });
  }

  remove(query) {
    const index = this.urls.findIndex((u) => u.code === query.code);
    if (index !== -1) {
      this.urls.splice(index, 1);
    }
    this.db.remove(query, {}, (err) => {
      if (err) log(`❌ DB remove error: ${err}`);
    });
  }
}

export default Database;
