import { z } from "zod";

const userIdSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});

export const updateMeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  role: z.enum(["user", "provider", "admin"]).optional(),
  active: z.boolean().optional(),
});

export { userIdSchema };
