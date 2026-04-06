import mongoose from "mongoose";
import logger from "../utils/logger.js";
import { MONGODB_URI, NODE_ENV } from "./env.config.js";

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    logger.info(`Connecting to MongoDB in ${NODE_ENV} mode...`);

    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 15000, 
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      family: 4,
      autoIndex: NODE_ENV === "production" ? false : true,

      // Better retry handling
      retryWrites: true,
      retryReads: true,
    });

    logger.info(` MongoDB Connected: ${conn.connection.host}`);
    logger.info(` Database Name: ${conn.connection.name}`);

    // Connection event handlers
    mongoose.connection.on("connected", () => {
      logger.info("MongoDB connection established");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected - attempting to reconnect");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected successfully");
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Closing MongoDB connection...`);
      try {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed");
        process.exit(0);
      } catch (err) {
        logger.error("Error closing MongoDB connection:", err);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    return conn;
  } catch (err) {
    logger.error("Database connection failed:", err.message);
    logger.error("Stack trace:", err.stack);
    throw err;
  }
};

export default connectDB;
