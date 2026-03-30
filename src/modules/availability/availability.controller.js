import * as availabilityService from './availability.service.js';

export const createAvailability = async (req, res, next) => {
  try {
    const result = await availabilityService.createAvailability(req.body);
    res.status(201).json(result);
  } catch (err) {
    // Distinguish between client errors and server errors
    if (err.name === 'ValidationError' || 
        err.message === 'This slot already exists' ||
        err.message.includes('Invalid date')) {
      res.status(400).json({ message: err.message });
    } else {
      // Pass to global error handler for 500 status
      next(err);
    }
  }
};

export const getAvailability = async (req, res, next) => {
  try {
    const providerId = req.params.providerId;
    const slots = await availabilityService.getAvailabilityByProvider(providerId);
    res.json(slots);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).json({ message: 'Invalid provider ID format' });
    } else {
      next(err);
    }
  }
};