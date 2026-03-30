import * as availabilityService from './availability.service.js';

export const createAvailability = async (req, res) => {
  try {
    const result = await availabilityService.createAvailability(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const slots = await availabilityService.getAvailabilityByProvider(providerId);
    res.json(slots);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};