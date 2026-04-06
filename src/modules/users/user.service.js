import User from "./user.model.js";
import { AppError } from "../../shared/utils/helpers.js";

export const getUsers = async (query = {}) => {
  const filter = {};
  if (query.role) {
    filter.role = query.role;
  }
  if (query.active !== undefined) {
    filter.active = query.active === "true";
  }
  return User.find(filter).select("-password");
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
    context: "query",
  }).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
