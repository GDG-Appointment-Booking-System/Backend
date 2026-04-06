import { z } from "zod";

export const userIdSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});

export const providerIdSchema = z.object({
  providerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid provider ID"),
});
