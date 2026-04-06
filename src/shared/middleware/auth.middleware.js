import jwt from "jsonwebtoken";
import { asyncHandler, AppError } from "../utils/helpers.js";
import { JWT_ACCESS_SECRET } from "../config/env.config.js";
import User from "../../modules/users/user.model.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError(
      "You are not logged in. Please log in to access this resource.",
      401,
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token expired. Please log in again.", 401);
    }
    throw new AppError("Invalid token. Please log in again.", 401);
  }

  const user = await User.findById(decoded.id).select("+passwordChangedAt");
  if (!user) {
    throw new AppError(
      "The user belonging to this token no longer exists.",
      401,
    );
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    throw new AppError("Password recently changed. Please log in again.", 401);
  }

  req.user = user;
  next();
});

export const restrictTo =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403),
      );
    }
    next();
  };
