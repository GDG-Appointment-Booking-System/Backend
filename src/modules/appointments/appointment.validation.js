import { z } from 'zod';

export const createAppointmentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  providerId: z.string().min(1, "Provider ID is required"),
  serviceId: z.string().min(1, "Service ID is required"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required")
});