import * as reviewService from "./review.service.js";
import { asyncHandler, ApiResponse } from "../../shared/utils/helpers.js";

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviews(req.query);
  res
    .status(200)
    .json(ApiResponse.success(reviews, "Reviews retrieved successfully"));
});

export const getReviewsByProvider = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviewsByProvider(
    req.params.providerId,
  );
  res
    .status(200)
    .json(
      ApiResponse.success(reviews, "Provider reviews retrieved successfully"),
    );
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  res
    .status(201)
    .json(ApiResponse.success(review, "Review added successfully", 201));
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(
    req.params.reviewId,
    req.user,
    req.body,
  );
  res
    .status(200)
    .json(ApiResponse.success(review, "Review updated successfully"));
});

export const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.reviewId, req.user);
  res
    .status(200)
    .json(ApiResponse.success(null, "Review removed successfully"));
});
