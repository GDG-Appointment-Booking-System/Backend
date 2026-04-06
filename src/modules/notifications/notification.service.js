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

// Helper function to send appointment notifications to both user and provider
export const sendAppointmentNotifications = async (appointment, type, additionalData = {}) => {
  const notifications = [];
  
  // Populate if not already populated
  const populatedAppointment = appointment.serviceId?.name 
    ? appointment 
    : await mongoose.model('Appointment').findById(appointment._id)
        .populate('userId', 'name email')
        .populate('providerId', 'name email')
        .populate('serviceId', 'name duration');
  
  const serviceName = populatedAppointment.serviceId?.name || 'appointment';
  const dateStr = populatedAppointment.date?.toLocaleDateString() || 'scheduled date';
  const timeStr = populatedAppointment.startTime || 'scheduled time';
  
  switch (type) {
    case 'confirmation':
      // User notification
      notifications.push({
        userId: populatedAppointment.userId._id,
        type: 'confirmation',
        title: 'Booking Confirmed',
        message: `Your ${serviceName} on ${dateStr} at ${timeStr} has been confirmed.`,
        data: { appointmentId: populatedAppointment._id, ...additionalData },
        link: `/appointments/${populatedAppointment._id}`
      });
      
      // Provider notification
      notifications.push({
        userId: populatedAppointment.providerId._id,
        type: 'confirmation',
        title: 'New Booking Confirmed',
        message: `${populatedAppointment.userId.name} confirmed ${serviceName} on ${dateStr} at ${timeStr}.`,
        data: { appointmentId: populatedAppointment._id, ...additionalData },
        link: `/provider/appointments/${populatedAppointment._id}`
      });
      break;
      
    case 'cancelled':
      // User notification
      notifications.push({
        userId: populatedAppointment.userId._id,
        type: 'cancelled',
        title: 'Booking Cancelled',
        message: `Your ${serviceName} on ${dateStr} at ${timeStr} has been cancelled.`,
        data: { appointmentId: populatedAppointment._id, reason: additionalData.reason, ...additionalData },
        link: `/appointments/${populatedAppointment._id}`
      });
      
      // Provider notification
      notifications.push({
        userId: populatedAppointment.providerId._id,
        type: 'cancelled',
        title: 'Booking Cancelled',
        message: `${populatedAppointment.userId.name} cancelled ${serviceName} on ${dateStr} at ${timeStr}.`,
        data: { appointmentId: populatedAppointment._id, reason: additionalData.reason, ...additionalData },
        link: `/provider/appointments/${populatedAppointment._id}`
      });
      break;
      
    case 'reminder':
      notifications.push({
        userId: populatedAppointment.userId._id,
        type: 'reminder',
        title: 'Upcoming Appointment Reminder',
        message: `Reminder: Your ${serviceName} is tomorrow at ${timeStr}.`,
        data: { appointmentId: populatedAppointment._id, ...additionalData },
        link: `/appointments/${populatedAppointment._id}`
      });
      break;
      
    case 'completed':
      notifications.push({
        userId: populatedAppointment.userId._id,
        type: 'completed',
        title: 'Service Completed',
        message: `Your ${serviceName} is complete. Please leave a review!`,
        data: { appointmentId: populatedAppointment._id, ...additionalData },
        link: `/appointments/${populatedAppointment._id}/review`
      });
      break;
      
    case 'rescheduled':
      notifications.push({
        userId: populatedAppointment.userId._id,
        type: 'rescheduled',
        title: 'Appointment Rescheduled',
        message: `Your ${serviceName} has been rescheduled to ${dateStr} at ${timeStr}.`,
        data: { appointmentId: populatedAppointment._id, ...additionalData },
        link: `/appointments/${populatedAppointment._id}`
      });
      
      notifications.push({
        userId: populatedAppointment.providerId._id,
        type: 'rescheduled',
        title: 'Appointment Rescheduled',
        message: `${populatedAppointment.userId.name} rescheduled ${serviceName} to ${dateStr} at ${timeStr}.`,
        data: { appointmentId: populatedAppointment._id, ...additionalData },
        link: `/provider/appointments/${populatedAppointment._id}`
      });
      break;
  }
  
  if (notifications.length > 0) {
    return await createBulkNotifications(notifications);
  }
  
  return [];
};
