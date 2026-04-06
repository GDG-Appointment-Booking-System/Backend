import { z } from "zod";

export const providerIdSchema = z.object({
  providerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid provider ID"),
});

export const createProviderSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  specialty: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
});

export const updateProviderSchema = z.object({
  businessName: z.string().min(2).optional(),
  specialty: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  active: z.boolean().optional(),
});
