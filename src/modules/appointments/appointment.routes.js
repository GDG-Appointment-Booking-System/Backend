import { Router } from 'express';
import * as appointmentController from './appointment.controller.js';
import { createAppointmentSchema } from './appointment.validation.js';
import validate from '../../shared/middleware/validate.js';

const router = Router();

// Create a new appointment
router.post('/', validate(createAppointmentSchema), appointmentController.createAppointment);

// Get all appointments for a specific user
router.get('/user/:userId', appointmentController.getUserAppointments);

export default router;