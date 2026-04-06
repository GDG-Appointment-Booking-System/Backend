import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../users/user.model.js";
import { AppError } from "../../shared/utils/helpers.js";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY,
  BCRYPT_ROUNDS,
} from "../../shared/config/env.config.js";

export const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role: data.role || "user",
    phone: data.phone || null,
    avatar: data.avatar || null,
  });
  return user;
};

export const verifyCredentials = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }
  return user;
};

export const createAuthTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRY },
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRY },
  );

  return { accessToken, refreshToken };
};

export const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  return createAuthTokens(user);
};

export const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ["name", "phone", "avatar"];
  const filteredData = Object.keys(updateData).reduce((acc, key) => {
    if (allowedFields.includes(key)) acc[key] = updateData[key];
    return acc;
  }, {});

  if (Object.keys(filteredData).length === 0) {
    throw new AppError("No allowed fields to update", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return updatedUser;
};
