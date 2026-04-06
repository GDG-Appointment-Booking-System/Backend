import { AppError } from "../../shared/utils/helpers.js";
import Service from "./service.model.js";
import Provider from "../providers/provider.model.js";

export const getServices = async (query = {}) => {
  const filter = {};
  if (query.providerId) {
    filter.provider = query.providerId;
  }
  if (query.active !== undefined) {
    filter.active = query.active === "true";
  }
  return Service.find(filter).populate(
    "provider",
    "businessName specialty location",
  );
};

export const getServiceById = async (serviceId) => {
  const service = await Service.findById(serviceId).populate(
    "provider",
    "businessName specialty location",
  );
  if (!service) {
    throw new AppError("Service not found", 404);
  }
  return service;
};

export const createService = async (userId, serviceData) => {
  const provider = await Provider.findOne({ user: userId });
  if (!provider) {
    throw new AppError("Provider profile not found for current user", 404);
  }

  const service = await Service.create({
    ...serviceData,
    provider: provider.id,
  });
  return service;
};

export const updateService = async (serviceId, currentUser, updateData) => {
  const service = await Service.findById(serviceId).populate("provider");
  if (!service) {
    throw new AppError("Service not found", 404);
  }

  if (
    currentUser.role !== "admin" &&
    service.provider.user.toString() !== currentUser.id
  ) {
    throw new AppError(
      "You do not have permission to update this service",
      403,
    );
  }

  Object.assign(service, updateData);
  await service.save();
  return service;
};

export const deleteService = async (serviceId, currentUser) => {
  const service = await Service.findById(serviceId).populate("provider");
  if (!service) {
    throw new AppError("Service not found", 404);
  }

  if (
    currentUser.role !== "admin" &&
    service.provider.user.toString() !== currentUser.id
  ) {
    throw new AppError(
      "You do not have permission to delete this service",
      403,
    );
  }

  await service.deleteOne();
  return service;
};
