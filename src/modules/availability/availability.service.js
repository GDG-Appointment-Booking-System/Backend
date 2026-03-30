import Availability from './availability.model.js';

export const createAvailability = async (data) => {
  const existing = await Availability.findOne({
    providerId: data.providerId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime
  });

  if (existing) throw new Error('This slot already exists');

  const availability = new Availability(data);
  return await availability.save();
};

export const getAvailabilityByProvider = async (providerId) => {
  return await Availability.find({ providerId }).sort({ date: 1, startTime: 1 });
};