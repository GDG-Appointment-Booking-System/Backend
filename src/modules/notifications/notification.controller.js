import * as notificationService from './notification.service.js';
import { asyncHandler, ApiResponse } from '../../shared/utils/helpers.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user.id, req.query);
  res.status(200).json(ApiResponse.success(result, 'Notifications retrieved successfully'));
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  res.status(200).json(ApiResponse.success({ count }, 'Unread count retrieved successfully'));
});

export const getNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.user.id, req.params.id);
  res.status(200).json(ApiResponse.success(notification, 'Notification retrieved successfully'));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.user.id, req.params.id);
  res.status(200).json(ApiResponse.success(notification, 'Notification marked as read'));
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  res.status(200).json(ApiResponse.success(result, 'All notifications marked as read'));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotification(req.user.id, req.params.id);
  res.status(200).json(ApiResponse.success(result, result.message));
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteAllNotifications(req.user.id);
  res.status(200).json(ApiResponse.success(result, `${result.count} notifications deleted`));
});

// Admin only - create notification for specific user
export const createNotification = asyncHandler(async (req, res) => {
  const { userId, type, title, message, data, link } = req.body;
  
  const notification = await notificationService.createNotification({
    userId,
    type,
    title,
    message,
    data: data || {},
    link
  });
  
  res.status(201).json(ApiResponse.success(notification, 'Notification created successfully'));
});
