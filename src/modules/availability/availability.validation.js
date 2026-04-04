import { z } from 'zod';

// Helper function to convert time string to minutes for comparison
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const createAvailabilitySchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { 
    message: "Invalid date format. Use YYYY-MM-DD or ISO date format" 
  }),
  startTime: z.string().min(1, "Start time is required").regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Start time must be in HH:MM format (24-hour)"
  }),
  endTime: z.string().min(1, "End time is required").regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "End time must be in HH:MM format (24-hour)"
  })
}).refine(data => {
  const start = timeToMinutes(data.startTime);
  const end = timeToMinutes(data.endTime);
  return start < end;
}, {
  message: "Start time must be before end time",
  path: ["startTime"]
});