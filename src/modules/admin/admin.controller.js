import * as adminService from "./admin.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/helpers.js";

export const getSystemStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getSystemStats();
  res
    .status(200)
    .json(
      ApiResponse.success(stats, "Admin statistics retrieved successfully"),
    );
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getUsers(req.query);
  res
    .status(200)
    .json(ApiResponse.success(users, "Users retrieved successfully"));
});

export const getProviders = asyncHandler(async (req, res) => {
  const providers = await adminService.getProviders(req.query);
  res
    .status(200)
    .json(ApiResponse.success(providers, "Providers retrieved successfully"));
});

export const approveProvider = asyncHandler(async (req, res) => {
  const provider = await adminService.approveProvider(req.params.providerId);
  res
    .status(200)
    .json(ApiResponse.success(provider, "Provider approved successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.userId);
  res.status(200).json(ApiResponse.success(null, "User deleted successfully"));
});

export const deleteProvider = asyncHandler(async (req, res) => {
  await adminService.deleteProvider(req.params.providerId);
  res
    .status(200)
    .json(ApiResponse.success(null, "Provider deleted successfully"));
});
