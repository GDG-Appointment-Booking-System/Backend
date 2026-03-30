import * as appointmentService from './appointment.service.js';

export const createAppointment = async (req, res) => {
  try {
    const result = await appointmentService.createAppointment(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointments = await appointmentService.getAppointmentsByUser(userId);
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};