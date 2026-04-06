import app from "./app.js";
import connectDB from "./shared/config/db.config.js";
import logger from "./shared/utils/logger.js";
import { PORT } from "./shared/config/env.config.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Unable to start server: %o", error);
    process.exit(1);
  }
};

startServer();
