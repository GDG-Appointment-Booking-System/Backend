import mongoose from 'mongoose';
import Availability from './availability.model.js';
import Appointment from '../appointments/appointment.model.js';
import { AppError } from '../../shared/utils/helpers.js';

export const createAvailability = async (data) => {
  const { isRecurring, recurringDays, recurringEndDate, ...rest } = data;
  const availabilityDate = new Date(rest.date);
  
  if (isNaN(availabilityDate.getTime())) {
    throw new AppError('Invalid date format', 400);
  }
  
  // Check for existing availability
  const existing = await Availability.findOne({
    providerId: rest.providerId,
    date: availabilityDate,
    startTime: rest.startTime
  });
  
  if (existing) {
    throw new AppError('Availability slot already exists for this time', 409);
  }
  
  // Handle recurring availability
  if (isRecurring && recurringDays && recurringDays.length > 0) {
    const slots = [];
    const endDate = recurringEndDate ? new Date(recurringEndDate) : new Date();
    
    // Default to 3 months if no end date specified
    if (!recurringEndDate) {
      endDate.setMonth(endDate.getMonth() + 3);
    }
    
    let currentDate = new Date(availabilityDate);
    while (currentDate <= endDate) {
      if (recurringDays.includes(currentDate.getDay())) {
        const slot = new Availability({
          ...rest,
          date: new Date(currentDate),
          isRecurring: true,
          recurringDays,
          recurringEndDate: endDate
        });
        slots.push(slot);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const createdSlots = await Availability.insertMany(slots);
    return createdSlots;
  }
  
  // Handle single availability
  const availability = new Availability({
    ...rest,
    date: availabilityDate
  });
  
  return await availability.save();
};

/**
 * Get all availability with filtering and pagination
 */
export const getAllAvailability = async (query = {}) => {
  const { date, page = 1, limit = 10, isRecurring, providerId, isBooked } = query;
  const filter = {};
  
  if (providerId) {
    filter.providerId = providerId;
  }
  
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    filter.date = { $gte: startDate, $lte: endDate };
  }
  
  if (isRecurring !== undefined) {
    filter.isRecurring = isRecurring === 'true';
  }
  
  if (isBooked !== undefined) {
    filter.isBooked = isBooked === 'true';
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);
  
  const [availability, total] = await Promise.all([
    Availability.find(filter)
      .populate('providerId', 'name email specialty phone')
      .populate('appointmentId', 'userId status createdAt')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limitNum),
    Availability.countDocuments(filter)
  ]);
  
  return {
    availability,
    pagination: {
      page: parseInt(page),
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  };
};

/**
 * Get single availability by ID
 */
export const getAvailabilityById = async (availabilityId) => {
  const availability = await Availability.findById(availabilityId)
    .populate('providerId', 'name email specialty phone bio')
    .populate('appointmentId', 'userId status serviceId date startTime endTime');
  
  if (!availability) {
    throw new AppError('Availability not found', 404);
  }
  
  return availability;
};

/**
 * Get availability for a specific provider
 */
export const getProviderAvailability = async (providerId, query = {}) => {
  const { date, startDate, endDate, page = 1, limit = 50, isBooked } = query;
  const filter = { providerId };
  
  // Date range filtering
  if (date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);
    filter.date = { $gte: targetDate, $lt: nextDate };
  }
  
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filter.date.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }
  
  if (isBooked !== undefined) {
    filter.isBooked = isBooked === 'true';
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);
  
  const [availability, total] = await Promise.all([
    Availability.find(filter)
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limitNum),
    Availability.countDocuments(filter)
  ]);
  
  return {
    availability,
    pagination: {
      page: parseInt(page),
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  };
};

/**
 * Get availability by specific date
 */
export const getAvailabilityByDate = async (providerId, date) => {
  const targetDate = new Date(date);
  
  if (isNaN(targetDate.getTime())) {
    throw new AppError('Invalid date format', 400);
  }
  
  targetDate.setHours(0, 0, 0, 0);
  
  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);
  
  const availability = await Availability.find({
    providerId,
    date: { $gte: targetDate, $lt: nextDate }
  }).sort({ startTime: 1 });
  
  return availability;
};

/**
 * Get available slots for a provider on a specific date
 * Excludes booked slots and checks capacity
 */
export const getAvailableSlots = async (providerId, date) => {
  const targetDate = new Date(date);
  
  if (isNaN(targetDate.getTime())) {
    throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
  }
  
  targetDate.setHours(0, 0, 0, 0);
  
  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);
  
  // Get all available slots for the day (not fully booked)
  const availableSlots = await Availability.find({
    providerId,
    date: { $gte: targetDate, $lt: nextDate },
    isBooked: false,
    $expr: { $lt: ["$currentBookings", "$maxBookings"] }
  }).sort({ startTime: 1 });
  
  // Get booked appointments for the day to check capacity
  const bookedAppointments = await Appointment.find({
    providerId,
    date: { $gte: targetDate, $lt: nextDate },
    status: { $in: ['pending', 'confirmed'] }
  });
  
  // Group appointments by time slot
  const appointmentsBySlot = {};
  bookedAppointments.forEach(app => {
    const key = `${app.startTime}-${app.endTime}`;
    if (!appointmentsBySlot[key]) appointmentsBySlot[key] = 0;
    appointmentsBySlot[key]++;
  });
  
  // Filter slots that still have capacity
  const filteredSlots = availableSlots.filter(slot => {
    const key = `${slot.startTime}-${slot.endTime}`;
    const currentBookings = appointmentsBySlot[key] || 0;
    return currentBookings < slot.maxBookings;
  });
  
  // Add availability info to each slot
  return filteredSlots.map(slot => ({
    _id: slot._id,
    providerId: slot.providerId,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    maxBookings: slot.maxBookings,
    availableSpots: slot.maxBookings - (appointmentsBySlot[`${slot.startTime}-${slot.endTime}`] || 0)
  }));
};

/**
 * Update availability slot
 */
export const updateAvailability = async (availabilityId, updateData) => {
  const availability = await Availability.findById(availabilityId);
  
  if (!availability) {
    throw new AppError('Availability not found', 404);
  }
  
  if (availability.isBooked) {
    throw new AppError('Cannot update an already booked availability slot', 400);
  }
  
  // Validate time format if updating
  if (updateData.startTime || updateData.endTime) {
    const startTime = updateData.startTime || availability.startTime;
    const endTime = updateData.endTime || availability.endTime;
    
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      throw new AppError('Start time must be before end time', 400);
    }
    
    // Check for conflicts with updated time
    const conflict = await Availability.findOne({
      _id: { $ne: availabilityId },
      providerId: availability.providerId,
      date: availability.date,
      startTime: startTime
    });
    
    if (conflict) {
      throw new AppError('A slot already exists at this time', 409);
    }
  }
  
  Object.assign(availability, updateData);
  await availability.save();
  
  return availability;
};

/**
 * Delete availability slot
 */
export const deleteAvailability = async (availabilityId) => {
  const availability = await Availability.findById(availabilityId);
  
  if (!availability) {
    throw new AppError('Availability not found', 404);
  }
  
  if (availability.isBooked) {
    throw new AppError('Cannot delete a booked availability slot. Cancel the appointment first.', 400);
  }
  
  await availability.deleteOne();
  return { message: 'Availability deleted successfully', id: availabilityId };
};

/**
 * Bulk delete availability (for a date range or provider)
 */
export const bulkDeleteAvailability = async (providerId, startDate, endDate) => {
  const filter = { providerId };
  
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filter.date.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }
  
  // Only delete non-booked slots
  filter.isBooked = false;
  
  const result = await Availability.deleteMany(filter);
  
  if (result.deletedCount === 0) {
    throw new AppError('No availability slots found to delete', 404);
  }
  
  return {
    message: `${result.deletedCount} availability slot(s) deleted successfully`,
    deletedCount: result.deletedCount
  };
};

/**
 * Get upcoming availability for a provider (next 7 days)
 */
export const getUpcomingAvailability = async (providerId, days = 7) => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  endDate.setHours(23, 59, 59, 999);
  
  const availability = await Availability.find({
    providerId,
    date: { $gte: startDate, $lte: endDate },
    isBooked: false
  }).sort({ date: 1, startTime: 1 });
  
  // Group by date
  const groupedByDate = {};
  availability.forEach(slot => {
    const dateKey = slot.date.toISOString().split('T')[0];
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(slot);
  });
  
  return groupedByDate;
};

/**
 * Check if a specific time slot is available
 */
export const checkSlotAvailability = async (providerId, date, startTime, endTime) => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  // Find the availability slot
  const availabilitySlot = await Availability.findOne({
    providerId,
    date: targetDate,
    startTime,
    endTime,
    isBooked: false
  });
  
  if (!availabilitySlot) {
    return { available: false, reason: 'Slot not found or already booked' };
  }
  
  // Check capacity
  const bookedCount = await Appointment.countDocuments({
    providerId,
    date: targetDate,
    startTime,
    endTime,
    status: { $in: ['pending', 'confirmed'] }
  });
  
  const availableSpots = availabilitySlot.maxBookings - bookedCount;
  
  return {
    available: availableSpots > 0,
    availableSpots,
    maxBookings: availabilitySlot.maxBookings,
    slot: availabilitySlot
  };
};