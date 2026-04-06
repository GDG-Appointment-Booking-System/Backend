import { Router } from "express";
import * as reviewController from "./review.controller.js";
import {
  protect,
  restrictTo,
} from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createReviewSchema, reviewIdSchema } from "./review.validation.js";

const router = Router();

router.get("/", reviewController.getReviews);
router.get("/provider/:providerId", reviewController.getReviewsByProvider);
router.use(protect);
router.post(
  "/",
  restrictTo("user", "provider", "admin"),
  validate(createReviewSchema),
  reviewController.createReview,
);
router.put(
  "/:reviewId",
  validate(reviewIdSchema, "params"),
  reviewController.updateReview,
);
router.delete(
  "/:reviewId",
  validate(reviewIdSchema, "params"),
  reviewController.deleteReview,
);

export default router;
