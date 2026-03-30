import Appointment from './appointment.model.js';
import Availability from '../availability/availability.model.js';

export const createAppointment = async (data) => {
  const slot = await Availability.findOne({
    providerId: data.providerId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime
  });

  if (!slot) throw new Error('Slot is not available');

  const conflict = await Appointment.findOne({
    providerId: data.providerId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime
  });

  if (conflict) throw new Error('This slot is already booked');

  const appointment = new Appointment(data);
  return await appointment.save();
};

export const getAppointmentsByUser = async (userId) => {
  return await Appointment.find({ userId }).sort({ date: 1, startTime: 1 });
};