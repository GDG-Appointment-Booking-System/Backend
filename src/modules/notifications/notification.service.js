import mongoose from 'mongoose';
import Notification from './notification.model.js';
import { AppError } from '../../shared/utils/helpers.js';

export const getUserNotifications = async (userId, query = {}) => {
  const { type, isRead, page = 1, limit = 20 } = query;
  const filter = { userId };
  
  if (type) filter.type = type;
  if (isRead !== undefined) filter.isRead = isRead === 'true';
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);
  
  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Notification.countDocuments(filter)
  ]);
  
  return {
    notifications,
    pagination: {
      page: parseInt(page),
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  };
};

export const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ userId, isRead: false });
};

export const getNotificationById = async (userId, notificationId) => {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }
  
  return notification;
};

export const markAsRead = async (userId, notificationId) => {
  const notification = await getNotificationById(userId, notificationId);
  
  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
  }
  
  return notification;
};

export const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  
  return {
    count: result.modifiedCount
  };
};

export const deleteNotification = async (userId, notificationId) => {
  const notification = await getNotificationById(userId, notificationId);
  await notification.deleteOne();
  return { message: 'Notification deleted' };
};

export const deleteAllNotifications = async (userId) => {
  const result = await Notification.deleteMany({ userId });
  return {
    count: result.deletedCount
  };
};

export const createNotification = async (data) => {
  const notification = new Notification(data);
  return await notification.save();
};

export const createBulkNotifications = async (notificationsData) => {
  return await Notification.insertMany(notificationsData);
};
