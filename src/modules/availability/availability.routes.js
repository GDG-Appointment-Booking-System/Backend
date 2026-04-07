/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Provider availability management
 */

/**
 * @swagger
 * /api/availability:
 *   get:
 *     summary: Get all availability slots
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: isBooked
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of availability slots
 *   post:
 *     summary: Create availability slot (Provider/Admin only)
 *     tags: [Availability]
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
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               providerId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-25
 *               startTime:
 *                 type: string
 *                 example: 09:00
 *               endTime:
 *                 type: string
 *                 example: 17:00
 *               isRecurring:
 *                 type: boolean
 *               recurringDays:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 5]
 *               maxBookings:
 *                 type: number
 *                 default: 1
 *     responses:
 *       201:
 *         description: Availability created
 */

/**
 * @swagger
 * /api/availability/check:
 *   get:
 *     summary: Check if a time slot is available
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           example: 14:00
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                 availableSpots:
 *                   type: number
 */

/**
 * @swagger
 * /api/availability/provider/{providerId}:
 *   get:
 *     summary: Get provider availability
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Provider availability
 */

/**
 * @swagger
 * /api/availability/provider/{providerId}/slots:
 *   get:
 *     summary: Get available slots for a provider on a date
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Available slots
 */

/**
 * @swagger
 * /api/availability/provider/{providerId}/upcoming:
 *   get:
 *     summary: Get upcoming availability (next 7 days)
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Upcoming availability
 */

/**
 * @swagger
 * /api/availability/{availabilityId}:
 *   get:
 *     summary: Get availability by ID
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: availabilityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability details
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update availability (Provider/Admin only)
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: availabilityId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               maxBookings:
 *                 type: number
 *     responses:
 *       200:
 *         description: Availability updated
 *   delete:
 *     summary: Delete availability (Provider/Admin only)
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: availabilityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability deleted
 */

/**
 * @swagger
 * /api/availability/bulk:
 *   delete:
 *     summary: Bulk delete availability (Provider/Admin only)
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Availability slots deleted
 */


import { Router } from 'express';
import * as availabilityController from './availability.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(protect);


router.get('/', availabilityController.getAllAvailability);

router.get('/check', availabilityController.checkSlotAvailability);

router.get('/provider/:providerId', availabilityController.getProviderAvailability);

router.get('/provider/:providerId/date/:date', availabilityController.getAvailabilityByDate);

router.get('/provider/:providerId/slots', availabilityController.getAvailableSlots);

router.get('/provider/:providerId/upcoming', availabilityController.getUpcomingAvailability);

router.get('/:availabilityId', availabilityController.getAvailabilityById);


router.post('/', restrictTo('provider', 'admin'), availabilityController.createAvailability);

// Update availability
router.put('/:availabilityId', restrictTo('provider', 'admin'), availabilityController.updateAvailability);

// Bulk delete availability
router.delete('/bulk', restrictTo('provider', 'admin'), availabilityController.bulkDeleteAvailability);

// Delete single availability
router.delete('/:availabilityId', restrictTo('provider', 'admin'), availabilityController.deleteAvailability);

export default router;
