import { z } from 'zod';

export const getNotificationsSchema = z.object({
  query: z.object({
    type: z.enum(['confirmation', 'reminder', 'cancelled', 'rescheduled', 'completed', 'response', 'review', 'promotion', 'system', 'update']).optional(),
    isRead: z.enum(['true', 'false']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
  })
});

export const notificationIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid notification ID format')
});

export const createNotificationSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    type: z.enum(['confirmation', 'reminder', 'cancelled', 'rescheduled', 'completed', 'response', 'review', 'promotion', 'system', 'update']),
    title: z.string().min(1).max(100),
    message: z.string().min(1).max(500),
    data: z.object({}).optional(),
    link: z.string().optional().nullable()
  })
});
