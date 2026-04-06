import { z } from "zod";

export const reviewIdSchema = z.object({
  reviewId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid review ID"),
});

export const createReviewSchema = z.object({
  providerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid provider ID"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().min(1, "Comment is required"),
  appointmentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid appointment ID")
    .optional(),
});
