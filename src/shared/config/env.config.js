import "dotenv/config";
import { z } from "zod";
import logger from "../utils/logger.js";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000").transform(Number),
  MONGODB_URI: z.string().min(1, "MongoDB URI is required"),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT access secret must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT refresh secret must be at least 32 characters"),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
  BCRYPT_ROUNDS: z.string().default("10").transform(Number),
  RATE_LIMIT_WINDOW_MS: z.string().default("900000").transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("100").transform(Number),
});

const validateEnv = () => {
  try {
    const parsedEnv = envSchema.parse(process.env);
    return parsedEnv;
  } catch (error) {
    logger.error("Environment validation failed");
    
    // Check if it's a ZodError
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        logger.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    } else {
      // Handle other types of errors
      logger.error("  Unexpected error:", error);
    }
    
    logger.error("💡 Missing or invalid environment variables");
    logger.error("Please check your .env file or Render environment variables");
    
    process.exit(1);
  }};

const env = validateEnv();
export const {
  PORT,
  NODE_ENV,
  MONGODB_URI,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY,
  BCRYPT_ROUNDS,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} = env;
