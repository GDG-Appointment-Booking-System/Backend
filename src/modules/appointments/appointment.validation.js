import { z } from 'zod';

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export const createAppointmentSchema = z.object({
  userId: z.string().min(1, "User ID is required").regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid User ID format"
  }),
  providerId: z.string().min(1, "Provider ID is required").regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid Provider ID format"
  }),
  serviceId: z.string().min(1, "Service ID is required").regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid Service ID format"
  }),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { 
    message: "Invalid date format. Use YYYY-MM-DD or ISO date format" 
  }),
  startTime: z.string().min(1, "Start time is required").regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Start time must be in HH:MM format (24-hour)"
  }),
  endTime: z.string().min(1, "End time is required").regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "End time must be in HH:MM format (24-hour)"
  }),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional()
}).refine(data => {
  const start = timeToMinutes(data.startTime);
  const end = timeToMinutes(data.endTime);
  return start < end;
}, {
  message: "Start time must be before end time",
  path: ["startTime"]
});

export const updateAppointmentSchema = z.object({
  date: z.string().refine(val => !isNaN(Date.parse(val)), { 
    message: "Invalid date format" 
  }).optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Start time must be in HH:MM format"
  }).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "End time must be in HH:MM format"
  }).optional(),
  notes: z.string().max(500).optional()
}).refine(data => {
  if (data.startTime && data.endTime) {
    return timeToMinutes(data.startTime) < timeToMinutes(data.endTime);
  }
  return true;
}, {
  message: "Start time must be before end time",
  path: ["startTime"]
});

export const appointmentIdSchema = z.object({
  appointmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid appointment ID format")
});

export const userIdParamSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
});

export const providerIdParamSchema = z.object({
  providerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid provider ID format")
});

export const appointmentQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional()
});