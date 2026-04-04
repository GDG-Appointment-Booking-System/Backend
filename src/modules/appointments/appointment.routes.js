import { Router } from 'express';
import * as appointmentController from './appointment.controller.js';

import { protect } from '../../shared/middleware/auth.middleware.js';
const router = Router();

// All routes require authentication
router.use(protect);

// Create appointment
router.post('/', appointmentController.createAppointment);

// Get all appointments with filters
router.get('/',  appointmentController.getAllAppointments);

// Get appointments by user
router.get('/user/:userId', appointmentController.getUserAppointments);

// Get appointments by provider
router.get('/provider/:providerId', appointmentController.getProviderAppointments);

// Get single appointment
router.get('/:appointmentId',  appointmentController.getAppointmentById);

// Update appointment
router.put('/:appointmentId',  appointmentController.updateAppointment);

// Confirm appointment
router.patch('/:appointmentId/confirm',  appointmentController.confirmAppointment);

// Cancel appointment
router.patch('/:appointmentId/cancel',  appointmentController.cancelAppointment);

// Complete appointment
router.patch('/:appointmentId/complete', appointmentController.completeAppointment);

// Delete appointment
router.delete('/:appointmentId',  appointmentController.deleteAppointment);

export default router;