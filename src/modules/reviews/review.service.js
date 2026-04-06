import { AppError } from "../../shared/utils/helpers.js";
import Review from "./review.model.js";
import Provider from "../providers/provider.model.js";

export const getReviews = async (query = {}) => {
  const filter = {};
  if (query.userId) {
    filter.user = query.userId;
  }
  if (query.providerId) {
    filter.provider = query.providerId;
  }
  return Review.find(filter)
    .populate("user", "name email")
    .populate("provider", "businessName specialty");
};

export const getReviewsByProvider = async (providerId) => {
  const provider = await Provider.findById(providerId);
  if (!provider) {
    throw new AppError("Provider not found", 404);
  }
  return Review.find({ provider: providerId }).populate("user", "name email");
};

export const createReview = async (userId, reviewData) => {
  const provider = await Provider.findById(reviewData.providerId);
  if (!provider) {
    throw new AppError("Provider not found", 404);
  }
  const review = await Review.create({
    user: userId,
    provider: reviewData.providerId,
    rating: reviewData.rating,
    comment: reviewData.comment,
    appointment: reviewData.appointmentId || null,
  });
  return review;
};

export const updateReview = async (reviewId, currentUser, updateData) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError("Review not found", 404);
  }
  if (
    currentUser.role !== "admin" &&
    review.user.toString() !== currentUser.id
  ) {
    throw new AppError("You do not have permission to update this review", 403);
  }
  review.rating = updateData.rating ?? review.rating;
  review.comment = updateData.comment ?? review.comment;
  await review.save();
  return review;
};

export const deleteReview = async (reviewId, currentUser) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError("Review not found", 404);
  }
  if (
    currentUser.role !== "admin" &&
    review.user.toString() !== currentUser.id
  ) {
    throw new AppError("You do not have permission to delete this review", 403);
  }
  await review.deleteOne();
  return review;
};
