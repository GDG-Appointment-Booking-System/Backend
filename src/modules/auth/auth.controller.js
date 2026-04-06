import * as authService from "./auth.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/helpers.js";

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatar: user.avatar,
  active: user.active,
  createdAt: user.createdAt,
});

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  const tokens = authService.createAuthTokens(user);
  res
    .status(201)
    .json(
      ApiResponse.success(
        { user: sanitizeUser(user), ...tokens },
        "User registered successfully",
        201,
      ),
    );
});

export const login = asyncHandler(async (req, res) => {
  const user = await authService.verifyCredentials(
    req.body.email,
    req.body.password,
  );
  const tokens = authService.createAuthTokens(user);
  res
    .status(200)
    .json(
      ApiResponse.success(
        { user: sanitizeUser(user), ...tokens },
        "Logged in successfully",
      ),
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const tokens = await authService.refreshTokens(req.body.refreshToken);
  res
    .status(200)
    .json(ApiResponse.success(tokens, "Access token refreshed successfully"));
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success(null, "Logged out successfully"));
});

export const getMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      ApiResponse.success(
        sanitizeUser(req.user),
        "Profile retrieved successfully",
      ),
    );
});

export const updateMe = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateUserProfile(
    req.user.id,
    req.body,
  );
  res
    .status(200)
    .json(
      ApiResponse.success(
        sanitizeUser(updatedUser),
        "Profile updated successfully",
      ),
    );
});
