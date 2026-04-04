import * as appointmentService from './appointment.service.js';

export const createAppointment = async (req, res, next) => {
  try {
    const result = await appointmentService.createAppointment(req.body);
    res.status(201).json(result);
  } catch (err) {
    // Distinguish between client errors and server errors
    if (err.name === 'ValidationError' || 
        err.message === 'Slot is not available' ||
        err.message === 'This slot is already booked' ||
        err.message.includes('Invalid date')) {
      res.status(400).json({ message: err.message });
    } else {
      // Pass to global error handler for 500 status
      next(err);
    }
  }
};

export const getUserAppointments = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const appointments = await appointmentService.getAppointmentsByUser(userId);
    res.json(appointments);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).json({ message: 'Invalid user ID format' });
    } else {
      next(err);
    }
  }
};