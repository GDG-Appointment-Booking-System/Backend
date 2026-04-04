import Availability from './availability.model.js';

export const createAvailability = async (data) => {
  // Convert string date to Date object
  const availabilityDate = new Date(data.date);
  
  // Validate the date
  if (isNaN(availabilityDate.getTime())) {
    throw new Error('Invalid date format');
  }
  
  const existing = await Availability.findOne({
    providerId: data.providerId,
    date: availabilityDate,
    startTime: data.startTime,
    endTime: data.endTime
  });

  if (existing) throw new Error('This slot already exists');

  // Create with normalized date
  const availability = new Availability({ 
    ...data, 
    date: availabilityDate 
  });
  return await availability.save();
};

export const getAvailabilityByProvider = async (providerId) => {
  return await Availability.find({ providerId }).sort({ date: 1, startTime: 1 });
};