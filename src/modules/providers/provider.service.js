import { AppError } from "../../shared/utils/helpers.js";
import Provider from "./provider.model.js";
import User from "../users/user.model.js";

export const getProviders = async (query = {}) => {
  const filter = {};
  if (query.approved !== undefined) {
    filter.isApproved = query.approved === "true";
  }
  return Provider.find(filter).populate("user", "name email role");
};

export const getProviderById = async (providerId) => {
  const provider = await Provider.findById(providerId).populate(
    "user",
    "name email role",
  );
  if (!provider) {
    throw new AppError("Provider not found", 404);
  }
  return provider;
};

export const createProvider = async (userId, providerData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const existing = await Provider.findOne({ user: userId });
  if (existing) {
    throw new AppError("Provider profile already exists for this user", 409);
  }

  const provider = await Provider.create({ ...providerData, user: userId });
  return provider;
};

export const updateProvider = async (providerId, currentUser, updateData) => {
  const provider = await Provider.findById(providerId);
  if (!provider) {
    throw new AppError("Provider not found", 404);
  }

  if (
    currentUser.role !== "admin" &&
    provider.user.toString() !== currentUser.id
  ) {
    throw new AppError(
      "You do not have permission to update this provider profile",
      403,
    );
  }

  Object.assign(provider, updateData);
  await provider.save();
  return provider;
};

export const approveProvider = async (providerId) => {
  const provider = await Provider.findById(providerId);
  if (!provider) {
    throw new AppError("Provider not found", 404);
  }
  provider.isApproved = true;
  provider.approvedAt = new Date();
  await provider.save();
  return provider;
};

export const deleteProvider = async (providerId) => {
  const provider = await Provider.findByIdAndDelete(providerId);
  if (!provider) {
    throw new AppError("Provider not found", 404);
  }
  return provider;
};
