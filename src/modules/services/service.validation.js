import { z } from "zod";

export const serviceIdSchema = z.object({
  serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid service ID"),
});

export const createServiceSchema = z.object({
  name: z.string().min(2, "Service name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  duration: z.number().min(5, "Duration must be at least 5 minutes"),
  price: z.number().min(0, "Price must be a positive number"),
  active: z.boolean().optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  duration: z.number().min(5).optional(),
  price: z.number().min(0).optional(),
  active: z.boolean().optional(),
});
