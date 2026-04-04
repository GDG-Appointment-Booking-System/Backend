import { Router } from 'express';
import * as availabilityController from './availability.controller.js';
import { createAvailabilitySchema } from './availability.validation.js';
import validate from '../../shared/middleware/validate.js';

const router = Router();

// Create a new availability slot
router.post('/', validate(createAvailabilitySchema), availabilityController.createAvailability);

// Get all slots by provider
router.get('/:providerId', availabilityController.getAvailability);

export default router;