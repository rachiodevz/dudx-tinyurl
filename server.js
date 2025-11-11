import { Database } from "./src/database/db.js";
import { UserDatabase } from "./src/database/userDb.js";
import { URLShortener } from "./src/main.js";
import { createApp } from "./src/app.js";
import config from "./src/config/index.js";
import { log } from "./src/utils/logger.js";

// Initialize databases
const urlDb = new Database();
const userDb = new UserDatabase();

// Initialize database and start server
async function startServer() {
  try {
    await urlDb.initialize();
    await userDb.initialize();

    // Create URL shortener with database
    const urlShortener = new URLShortener(urlDb);

    // Create Express app
    const app = createApp(urlShortener, userDb);

    // Start server
    const PORT = config.port || 8080;
    app.listen(PORT, () => {
      log(`🚀 TinyURL server running at http://localhost:${PORT}`);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down gracefully...");
      process.exit(0);
    });
  } catch (error) {
    log(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
