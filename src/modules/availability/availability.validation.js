import { z } from 'zod';

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const createAvailabilitySchema = z.object({
  providerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid provider ID format"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { 
    message: "Invalid date format" 
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Start time must be in HH:MM format"
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "End time must be in HH:MM format"
  }),
  isRecurring: z.boolean().optional(),
  recurringDays: z.array(z.number().min(0).max(6)).optional(),
  recurringEndDate: z.string().refine(val => !isNaN(Date.parse(val)), { 
    message: "Invalid recurring end date format" 
  }).optional(),
  maxBookings: z.number().min(1).max(100).optional()
}).refine(data => {
  const start = timeToMinutes(data.startTime);
  const end = timeToMinutes(data.endTime);
  return start < end;
}, {
  message: "Start time must be before end time",
  path: ["startTime"]
});

export const updateAvailabilitySchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Start time must be in HH:MM format"
  }).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "End time must be in HH:MM format"
  }).optional(),
  maxBookings: z.number().min(1).max(100).optional()
}).refine(data => {
  if (data.startTime && data.endTime) {
    return timeToMinutes(data.startTime) < timeToMinutes(data.endTime);
  }
  return true;
}, {
  message: "Start time must be before end time",
  path: ["startTime"]
});