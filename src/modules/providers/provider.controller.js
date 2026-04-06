import * as providerService from "./provider.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/helpers.js";

export const getProviders = asyncHandler(async (req, res) => {
  const providers = await providerService.getProviders(req.query);
  res
    .status(200)
    .json(ApiResponse.success(providers, "Providers retrieved successfully"));
});

export const getProviderById = asyncHandler(async (req, res) => {
  const provider = await providerService.getProviderById(req.params.providerId);
  res
    .status(200)
    .json(ApiResponse.success(provider, "Provider retrieved successfully"));
});

export const createProvider = asyncHandler(async (req, res) => {
  const provider = await providerService.createProvider(req.user.id, req.body);
  res
    .status(201)
    .json(
      ApiResponse.success(
        provider,
        "Provider profile created successfully",
        201,
      ),
    );
});

export const updateProvider = asyncHandler(async (req, res) => {
  const provider = await providerService.updateProvider(
    req.params.providerId,
    req.user,
    req.body,
  );
  res
    .status(200)
    .json(
      ApiResponse.success(provider, "Provider profile updated successfully"),
    );
});

export const approveProvider = asyncHandler(async (req, res) => {
  const provider = await providerService.approveProvider(req.params.providerId);
  res
    .status(200)
    .json(ApiResponse.success(provider, "Provider approved successfully"));
});

export const deleteProvider = asyncHandler(async (req, res) => {
  await providerService.deleteProvider(req.params.providerId);
  res
    .status(200)
    .json(ApiResponse.success(null, "Provider removed successfully"));
});
