import Appointment from './appointment.model.js';
import Availability from '../availability/availability.model.js';

export const createAppointment = async (data) => {
  // Convert string date to Date object
  const appointmentDate = new Date(data.date);
  
  // Validate the date
  if (isNaN(appointmentDate.getTime())) {
    throw new Error('Invalid date format');
  }
  
  // Check if slot exists in availability
  const slot = await Availability.findOne({
    providerId: data.providerId,
    date: appointmentDate,
    startTime: data.startTime,
    endTime: data.endTime
  });

  if (!slot) throw new Error('Slot is not available');

  // Check for conflicting appointments (excluding cancelled ones)
  const conflict = await Appointment.findOne({
    providerId: data.providerId,
    date: appointmentDate,
    startTime: data.startTime,
    endTime: data.endTime,
    status: { $ne: 'cancelled' }
  });

  if (conflict) throw new Error('This slot is already booked');

  // Create appointment with normalized date
  const appointment = new Appointment({ 
    ...data, 
    date: appointmentDate 
  });
  return await appointment.save();
};

export const getAppointmentsByUser = async (userId) => {
  return await Appointment.find({ userId }).sort({ date: 1, startTime: 1 });
};