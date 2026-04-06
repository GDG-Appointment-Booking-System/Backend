import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from "../config/env.config.js";
import { AppError } from "../utils/helpers.js";

const requests = new Map();

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const entry = requests.get(ip) || [];
  const recentRequests = entry.filter((timestamp) => timestamp > windowStart);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return next(
      new AppError(
        "Too many requests from this IP, please try again later.",
        429,
      ),
    );
  }

  recentRequests.push(now);
  requests.set(ip, recentRequests);
  next();
};
