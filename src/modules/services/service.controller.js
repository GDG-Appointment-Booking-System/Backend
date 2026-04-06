import * as serviceService from "./service.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/helpers.js";

export const getServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getServices(req.query);
  res
    .status(200)
    .json(ApiResponse.success(services, "Services retrieved successfully"));
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.serviceId);
  res
    .status(200)
    .json(ApiResponse.success(service, "Service retrieved successfully"));
});

export const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.user.id, req.body);
  res
    .status(201)
    .json(ApiResponse.success(service, "Service created successfully", 201));
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(
    req.params.serviceId,
    req.user,
    req.body,
  );
  res
    .status(200)
    .json(ApiResponse.success(service, "Service updated successfully"));
});

export const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.params.serviceId, req.user);
  res
    .status(200)
    .json(ApiResponse.success(null, "Service deleted successfully"));
});
