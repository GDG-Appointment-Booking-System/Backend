import { Router } from 'express';
import * as notificationController from './notification.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { getNotificationsSchema, notificationIdSchema, createNotificationSchema } from './notification.validation.js';

const router = Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/', validate(getNotificationsSchema), notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.get('/:id', validate(notificationIdSchema), notificationController.getNotification);
router.patch('/:id/read', validate(notificationIdSchema), notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', validate(notificationIdSchema), notificationController.deleteNotification);
router.delete('/', notificationController.deleteAllNotifications);

// Admin only
router.post('/', restrictTo('admin'), validate(createNotificationSchema), notificationController.createNotification);

export default router;
