import User from "../users/user.model.js";
import Provider from "../providers/provider.model.js";
import Appointment from "../appointments/appointment.model.js";
import { AppError } from "../../shared/utils/helpers.js";

export const getSystemStats = async () => {
  const users = await User.countDocuments();
  const providers = await Provider.countDocuments();
  const appointments = await Appointment.countDocuments();

  return {
    users,
    providers,
    appointments,
  };
};

export const getUsers = async (query = {}) => {
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.active !== undefined) filter.active = query.active === "true";
  return User.find(filter).select("-password");
};

export const getProviders = async (query = {}) => {
  const filter = {};
  if (query.approved !== undefined)
    filter.isApproved = query.approved === "true";
  return Provider.find(filter).populate("user", "name email role");
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

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const deleteProvider = async (providerId) => {
  const provider = await Provider.findByIdAndDelete(providerId);
  if (!provider) {
    throw new AppError("Provider not found", 404);
  }
  return provider;
};
