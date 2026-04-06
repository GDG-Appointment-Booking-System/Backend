import mongoose from 'mongoose';
import Appointment from './appointment.model.js';
import Availability from '../availability/availability.model.js';
import { AppError } from '../../shared/utils/helpers.js';
import { createNotification } from '../notifications/notification.service.js';

export const createAppointment = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const appointmentDate = new Date(data.date);
    
    if (isNaN(appointmentDate.getTime())) {
      throw new AppError('Invalid date format', 400);
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      throw new AppError('Cannot book appointments for past dates', 400);
    }

    // Check if slot exists in availability
    const slot = await Availability.findOne({
      providerId: data.providerId,
      date: appointmentDate,
      startTime: data.startTime,
      endTime: data.endTime,
      isBooked: false
    }).session(session);

    if (!slot) {
      throw new AppError('Slot is not available', 400);
    }

    // Check for conflicting appointments
    const conflict = await Appointment.findOne({
      providerId: data.providerId,
      date: appointmentDate,
      startTime: data.startTime,
      status: { $in: ['pending', 'confirmed'] }
    }).session(session);

    if (conflict) {
      throw new AppError('This slot is already booked', 409);
    }

    // Create appointment
    const appointment = new Appointment({ 
      ...data, 
      date: appointmentDate 
    });
    
    await appointment.save({ session });

    // Mark slot as booked in availability
    slot.isBooked = true;
    slot.appointmentId = appointment._id;
    await slot.save({ session });

    await session.commitTransaction();
    
    // Send notification to user
    await createNotification({
      userId: appointment.userId,
      type: 'confirmation',
      title: 'Booking Request Received',
      message: `Your appointment request has been received. Waiting for provider confirmation.`,
      data: { 
        appointmentId: appointment._id,
        providerId: appointment.providerId,
        serviceId: appointment.serviceId,
        date: appointment.date,
        startTime: appointment.startTime
      },
      link: `/appointments/${appointment._id}`
    });
    
    return appointment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getAllAppointments = async (query = {}) => {
  const { status, date, page = 1, limit = 10 } = query;
  const filter = {};
  
  if (status) filter.status = status;
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    filter.date = { $gte: startDate, $lte: endDate };
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);
  
  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate('userId', 'name email')
      .populate('providerId', 'name email specialty')
      .populate('serviceId', 'name duration price')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limitNum),
    Appointment.countDocuments(filter)
  ]);
  
  return {
    appointments,
    pagination: {
      page: parseInt(page),
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  };
};

export const getAppointmentById = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate('userId', 'name email phone')
    .populate('providerId', 'name email specialty')
    .populate('serviceId', 'name duration price description');
  
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }
  
  return appointment;
};

export const getAppointmentsByUser = async (userId, query = {}) => {
  const { status, page = 1, limit = 10 } = query;
  const filter = { userId };
  
  if (status) filter.status = status;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);
  
  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate('providerId', 'name email specialty')
      .populate('serviceId', 'name duration price')
      .sort({ date: -1, startTime: 1 })
      .skip(skip)
      .limit(limitNum),
    Appointment.countDocuments(filter)
  ]);
  
  return {
    appointments,
    pagination: {
      page: parseInt(page),
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  };
};

export const getAppointmentsByProvider = async (providerId, query = {}) => {
  const { status, date, page = 1, limit = 10 } = query;
  const filter = { providerId };
  
  if (status) filter.status = status;
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    filter.date = { $gte: startDate, $lte: endDate };
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);
  
  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate('userId', 'name email phone')
      .populate('serviceId', 'name duration price')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limitNum),
    Appointment.countDocuments(filter)
  ]);
  
  return {
    appointments,
    pagination: {
      page: parseInt(page),
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  };
};

export const updateAppointment = async (appointmentId, updateData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const appointment = await Appointment.findById(appointmentId).session(session);
    
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }
    
    if (appointment.status === 'cancelled') {
      throw new AppError('Cannot update cancelled appointment', 400);
    }
    
    if (appointment.status === 'completed') {
      throw new AppError('Cannot update completed appointment', 400);
    }
    
    // If rescheduling, check availability
    if (updateData.date || updateData.startTime || updateData.endTime) {
      const newDate = updateData.date ? new Date(updateData.date) : appointment.date;
      const newStartTime = updateData.startTime || appointment.startTime;
      const newEndTime = updateData.endTime || appointment.endTime;
      
      // Check for conflicts
      const conflict = await Appointment.findOne({
        _id: { $ne: appointmentId },
        providerId: appointment.providerId,
        date: newDate,
        startTime: newStartTime,
        status: { $in: ['pending', 'confirmed'] }
      }).session(session);
      
      if (conflict) {
        throw new AppError('This slot is already booked', 409);
      }
      
      // Update availability slot if needed
      if (newDate.getTime() !== appointment.date.getTime() || 
          newStartTime !== appointment.startTime) {
        // Free up old slot in availability
        await Availability.findOneAndUpdate(
          {
            providerId: appointment.providerId,
            date: appointment.date,
            startTime: appointment.startTime
          },
          { isBooked: false, appointmentId: null },
          { session }
        );
        
        // Book new slot
        const newSlot = await Availability.findOne({
          providerId: appointment.providerId,
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
          isBooked: false
        }).session(session);
        
        if (!newSlot) {
          throw new AppError('New slot is not available', 400);
        }
        
        newSlot.isBooked = true;
        newSlot.appointmentId = appointmentId;
        await newSlot.save({ session });
      }
      
      updateData.date = newDate;
    }
    
    Object.assign(appointment, updateData);
    await appointment.save({ session });
    
    await session.commitTransaction();
    return appointment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const confirmAppointment = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate('userId', 'name email')
    .populate('serviceId', 'name');
  
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }
  
  if (appointment.status !== 'pending') {
    throw new AppError(`Cannot confirm appointment with status: ${appointment.status}`, 400);
  }
  
  appointment.status = 'confirmed';
  appointment.confirmedAt = new Date();
  await appointment.save();
  
  // Send confirmation notification
  await createNotification({
    userId: appointment.userId._id,
    type: 'confirmation',
    title: 'Appointment Confirmed',
    message: `Your ${appointment.serviceId.name} appointment has been confirmed for ${appointment.date.toLocaleDateString()} at ${appointment.startTime}`,
    data: { 
      appointmentId: appointment._id,
      serviceName: appointment.serviceId.name,
      date: appointment.date,
      startTime: appointment.startTime
    },
    link: `/appointments/${appointment._id}`
  });
  
  return appointment;
};

export const cancelAppointment = async (appointmentId, reason = null) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate('userId', 'name email')
      .populate('serviceId', 'name')
      .session(session);
    
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }
    
    if (appointment.status === 'cancelled') {
      throw new AppError('Appointment is already cancelled', 400);
    }
    
    if (appointment.status === 'completed') {
      throw new AppError('Cannot cancel completed appointment', 400);
    }
    
    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date();
    if (reason) appointment.cancellationReason = reason;
    await appointment.save({ session });
    
    // Free up the slot in availability
    await Availability.findOneAndUpdate(
      {
        providerId: appointment.providerId,
        date: appointment.date,
        startTime: appointment.startTime
      },
      { isBooked: false, appointmentId: null },
      { session }
    );
    
    await session.commitTransaction();
    
    // Send cancellation notification
    await createNotification({
      userId: appointment.userId._id,
      type: 'cancelled',
      title: 'Appointment Cancelled',
      message: `Your ${appointment.serviceId.name} appointment on ${appointment.date.toLocaleDateString()} has been cancelled${reason ? `: ${reason}` : ''}`,
      data: { 
        appointmentId: appointment._id,
        serviceName: appointment.serviceId.name,
        date: appointment.date,
        startTime: appointment.startTime,
        reason: reason
      },
      link: `/appointments/${appointment._id}`
    });
    
    return appointment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const completeAppointment = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate('userId', 'name email')
    .populate('serviceId', 'name')
    .populate('providerId', 'name');
  
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }
  
  if (appointment.status !== 'confirmed') {
    throw new AppError(`Cannot complete appointment with status: ${appointment.status}`, 400);
  }
  
  appointment.status = 'completed';
  appointment.completedAt = new Date();
  await appointment.save();
  
  // Send completion notification 
  await createNotification({
    userId: appointment.userId._id,
    type: 'completed',
    title: 'Service Completed',
    message: `Your ${appointment.serviceId.name} appointment is complete. How was your experience? Please leave a review!`,
    data: { 
      appointmentId: appointment._id,
      serviceName: appointment.serviceId.name,
      providerId: appointment.providerId,
      providerName: appointment.providerId.name,
      date: appointment.date
    },
    link: `/appointments/${appointment._id}/review`
  });
  
  return appointment;
};

export const deleteAppointment = async (appointmentId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const appointment = await Appointment.findByIdAndDelete(appointmentId).session(session);
    
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }
    
    // Free up the slot in availability if appointment wasn't cancelled/completed
    if (appointment.status !== 'cancelled' && appointment.status !== 'completed') {
      await Availability.findOneAndUpdate(
        {
          providerId: appointment.providerId,
          date: appointment.date,
          startTime: appointment.startTime
        },
        { isBooked: false, appointmentId: null },
        { session }
      );
    }
    
    await session.commitTransaction();
    return { message: 'Appointment deleted successfully' };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
