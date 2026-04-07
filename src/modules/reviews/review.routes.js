/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Provider reviews and ratings
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *         description: Filter by provider
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *     responses:
 *       200:
 *         description: List of reviews
 *   post:
 *     summary: Create a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - providerId
 *               - rating
 *             properties:
 *               providerId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c86
 *               appointmentId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent service from Laloo Hailu!
 *     responses:
 *       201:
 *         description: Review created
 */

/**
 * @swagger
 * /api/reviews/provider/{providerId}:
 *   get:
 *     summary: Get reviews by provider
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Provider reviews
 */

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 */


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
