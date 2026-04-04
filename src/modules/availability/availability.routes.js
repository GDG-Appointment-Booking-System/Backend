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