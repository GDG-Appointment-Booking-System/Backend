import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import DailyRotateFile from "winston-daily-rotate-file";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const redactFormat = winston.format((info) => {
  const redactSensitive = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const safe = { ...obj };
    if (safe.password) safe.password = "[REDACTED]";
    if (safe.token) safe.token = "[REDACTED]";
    if (safe.authorization) safe.authorization = "[REDACTED]";
    return safe;
  };
  info = redactSensitive(info);
  if (info.metadata) info.metadata = redactSensitive(info.metadata);
  return info;
});

const fileFormat = winston.format.combine(
  redactFormat(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  levels,
  format: fileFormat,
  defaultMeta: { service: "appointment-booking" },
  transports: [
    new DailyRotateFile({
      filename: path.join(logDirectory, "error-%DATE%.log"),
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: path.join(logDirectory, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({ format: consoleFormat }));
}

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception: %o", err);
  setTimeout(() => process.exit(1), 1000);
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection: %o", err);
  setTimeout(() => process.exit(1), 1000);
});

export default logger;
