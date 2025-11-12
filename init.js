/**
 * TinyURL Application Entry Point
 *
 * This file initializes the application and starts the server.
 * All business logic should go in src/main.js
 */

import config from "./src/config/index.js";
import Database from "./src/database/db.js";
import UserDatabase from "./src/database/userDb.js";
import GuestDatabase from "./src/models/guest.js";
import URLShortener from "./src/main.js";
import { createApp } from "./src/app.js";
import { log } from "./src/utils/logger.js";

async function init() {
  try {
    // Initialize databases
    log("📦 Initializing URL database...");
    const database = new Database();
    await database.initialize();

    log("📦 Initializing User database...");
    const userDb = new UserDatabase();
    await userDb.initialize();

    log("📦 Initializing Guest database...");
    const guestDb = new GuestDatabase();
    await guestDb.initialize();

    // Initialize business logic
    log("🎯 Initializing URL Shortener...");
    const urlShortener = new URLShortener(database);

    // Create Express app
    log("⚙️  Setting up Express app...");
    const app = createApp(urlShortener, userDb, guestDb);

    // Start server
    app.listen(config.port, () => {
      log(`🚀 TinyURL server running at http://localhost:${config.port}`);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      log("\n🛑 Shutting down gracefully...");
      process.exit(0);
    });
  } catch (error) {
    log(`❌ Failed to initialize application: ${error.message}`);
    log(`Stack: ${error.stack}`);
    process.exit(1);
  }
}

// Start the application
init();
