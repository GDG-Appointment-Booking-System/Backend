/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment booking and management
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments (with filters)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of appointments
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - providerId
 *               - serviceId
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               providerId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c86
 *               serviceId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c87
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-25
 *               startTime:
 *                 type: string
 *                 example: 14:00
 *               endTime:
 *                 type: string
 *                 example: 15:00
 *               notes:
 *                 type: string
 *                 example: I will be coming from Bole
 *     responses:
 *       201:
 *         description: Appointment created
 *       400:
 *         description: Slot not available
 *       409:
 *         description: Slot already booked
 */

/**
 * @swagger
 * /api/appointments/user/{userId}:
 *   get:
 *     summary: Get appointments for a specific user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's appointments
 */

/**
 * @swagger
 * /api/appointments/provider/{providerId}:
 *   get:
 *     summary: Get appointments for a specific provider
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Provider's appointments
 */

/**
 * @swagger
 * /api/appointments/{appointmentId}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details
 *       404:
 *         description: Appointment not found
 *   put:
 *     summary: Update appointment (reschedule)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *       400:
 *         description: Cannot update cancelled/completed appointment
 *   delete:
 *     summary: Delete appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment deleted
 */

/**
 * @swagger
 * /api/appointments/{appointmentId}/confirm:
 *   patch:
 *     summary: Confirm an appointment (Provider only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment confirmed
 *       400:
 *         description: Cannot confirm appointment with current status
 */

/**
 * @swagger
 * /api/appointments/{appointmentId}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Schedule conflict
 *     responses:
 *       200:
 *         description: Appointment cancelled
 *       400:
 *         description: Cannot cancel completed appointment
 */

/**
 * @swagger
 * /api/appointments/{appointmentId}/complete:
 *   patch:
 *     summary: Mark appointment as completed (Provider only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment completed
 *       400:
 *         description: Only confirmed appointments can be completed
 */

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
