import * as userService from "./user.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/helpers.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res
    .status(200)
    .json(ApiResponse.success(user, "Profile retrieved successfully"));
});

export const updateMe = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.user.id, req.body);
  res
    .status(200)
    .json(ApiResponse.success(updatedUser, "Profile updated successfully"));
});

export const deleteMe = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.user.id);
  res
    .status(200)
    .json(
      ApiResponse.success(null, "Your account has been deleted successfully"),
    );
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers(req.query);
  res
    .status(200)
    .json(ApiResponse.success(users, "Users retrieved successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res
    .status(200)
    .json(ApiResponse.success(user, "User retrieved successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.userId, req.body);
  res
    .status(200)
    .json(ApiResponse.success(updatedUser, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.userId);
  res.status(200).json(ApiResponse.success(null, "User deleted successfully"));
});
