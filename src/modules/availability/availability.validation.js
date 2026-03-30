import { z } from 'zod';

export const createAvailabilitySchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required")
});