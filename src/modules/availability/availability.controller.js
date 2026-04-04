import * as availabilityService from './availability.service.js';
import { asyncHandler, ApiResponse } from '../../shared/utils/helpers.js';

/**
 * CREATE - Set availability
 * POST /api/availability
 */
export const createAvailability = asyncHandler(async (req, res) => {
  const { providerId, date, startTime, endTime, isRecurring, recurringDays, recurringEndDate, maxBookings } = req.body;
  
  // Validation
  if (!providerId || !date || !startTime || !endTime) {
    return res.status(400).json(ApiResponse.error('Missing required fields: providerId, date, startTime, endTime'));
  }
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return res.status(400).json(ApiResponse.error('Time must be in HH:MM format (24-hour)'));
  }
  
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
    return res.status(400).json(ApiResponse.error('Start time must be before end time'));
  }
  
  if (isRecurring && (!recurringDays || recurringDays.length === 0)) {
    return res.status(400).json(ApiResponse.error('Recurring days are required for recurring availability'));
  }
  
  if (maxBookings && (maxBookings < 1 || maxBookings > 100)) {
    return res.status(400).json(ApiResponse.error('Max bookings must be between 1 and 100'));
  }
  
  const result = await availabilityService.createAvailability(req.body);
  res.status(201).json(ApiResponse.success(result, 'Availability created successfully', 201));
});

/**
 * READ - Get all availability
 * GET /api/availability
 */
export const getAllAvailability = asyncHandler(async (req, res) => {
  const { date, page, limit, isRecurring, providerId, isBooked } = req.query;
  
  // Validate query params
  if (date && isNaN(Date.parse(date))) {
    return res.status(400).json(ApiResponse.error('Invalid date format'));
  }
  
  if (page && (isNaN(parseInt(page)) || parseInt(page) < 1)) {
    return res.status(400).json(ApiResponse.error('Page must be a positive number'));
  }
  
  if (limit && (isNaN(parseInt(limit)) || parseInt(limit) < 1)) {
    return res.status(400).json(ApiResponse.error('Limit must be a positive number'));
  }
  
  const result = await availabilityService.getAllAvailability(req.query);
  res.status(200).json(ApiResponse.success(result, 'Availability retrieved successfully'));
});

/**
 * READ - Get single availability
 * GET /api/availability/:availabilityId
 */
export const getAvailabilityById = asyncHandler(async (req, res) => {
  const { availabilityId } = req.params;
  
  if (!availabilityId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(ApiResponse.error('Invalid availability ID format'));
  }
  
  const result = await availabilityService.getAvailabilityById(availabilityId);
  res.status(200).json(ApiResponse.success(result, 'Availability retrieved successfully'));
});

/**
 * READ - Get provider availability
 * GET /api/availability/provider/:providerId
 */
export const getProviderAvailability = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  const { date, startDate, endDate, page, limit, isBooked } = req.query;
  
  if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(ApiResponse.error('Invalid provider ID format'));
  }
  
  if (date && isNaN(Date.parse(date))) {
    return res.status(400).json(ApiResponse.error('Invalid date format'));
  }
  
  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json(ApiResponse.error('Invalid start date format'));
  }
  
  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json(ApiResponse.error('Invalid end date format'));
  }
  
  const result = await availabilityService.getProviderAvailability(providerId, req.query);
  res.status(200).json(ApiResponse.success(result, 'Provider availability retrieved successfully'));
});

/**
 * READ - Get availability by date
 * GET /api/availability/provider/:providerId/date/:date
 */
export const getAvailabilityByDate = asyncHandler(async (req, res) => {
  const { providerId, date } = req.params;
  
  if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(ApiResponse.error('Invalid provider ID format'));
  }
  
  if (isNaN(Date.parse(date))) {
    return res.status(400).json(ApiResponse.error('Invalid date format. Use YYYY-MM-DD'));
  }
  
  const result = await availabilityService.getAvailabilityByDate(providerId, date);
  res.status(200).json(ApiResponse.success(result, 'Availability by date retrieved successfully'));
});

/**
 * READ - Get available slots
 * GET /api/availability/provider/:providerId/slots?date=YYYY-MM-DD
 */
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  const { date } = req.query;
  
  if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(ApiResponse.error('Invalid provider ID format'));
  }
  
  if (!date) {
    return res.status(400).json(ApiResponse.error('Date query parameter is required (YYYY-MM-DD)'));
  }
  
  if (isNaN(Date.parse(date))) {
    return res.status(400).json(ApiResponse.error('Invalid date format. Use YYYY-MM-DD'));
  }
  
  const result = await availabilityService.getAvailableSlots(providerId, date);
  res.status(200).json(ApiResponse.success(result, 'Available slots retrieved successfully'));
});

/**
 * READ - Get upcoming availability (next 7 days)
 * GET /api/availability/provider/:providerId/upcoming?days=7
 */
export const getUpcomingAvailability = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  const { days = 7 } = req.query;
  
  if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(ApiResponse.error('Invalid provider ID format'));
  }
  
  const numDays = parseInt(days);
  if (isNaN(numDays) || numDays < 1 || numDays > 30) {
    return res.status(400).json(ApiResponse.error('Days must be between 1 and 30'));
  }
  
  const result = await availabilityService.getUpcomingAvailability(providerId, numDays);
  res.status(200).json(ApiResponse.success(result, 'Upcoming availability retrieved successfully'));
});

/**
 * READ - Check slot availability
 * GET /api/availability/check?providerId=&date=&startTime=&endTime=
 */
export const checkSlotAvailability = asyncHandler(async (req, res) => {
  const { providerId, date, startTime, endTime } = req.query;
  
  if (!providerId || !date || !startTime) {
    return res.status(400).json(ApiResponse.error('Missing required query params: providerId, date, startTime'));
  }
  
  if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(ApiResponse.error('Invalid provider ID format'));
  }
  
  if (isNaN(Date.parse(date))) {
    return res.status(400).json(ApiResponse.error('Invalid date format'));
  }
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(startTime)) {
    return res.status(400).json(ApiResponse.error('Start time must be in HH:MM format'));
  }
  
  if (endTime && !timeRegex.test(endTime)) {
    return res.status(400).json(ApiResponse.error('End time must be in HH:MM format'));
  }
  
  const result = await availabilityService.checkSlotAvailability(providerId, date, startTime, endTime);
  res.status(200).json(ApiResponse.success(result, 'Slot availability checked successfully'));
});

/**
 * UPDATE - Update availability
 * PUT /api/availability/:availabilityId
 */
export const updateAvailability = asyncHandler(async (req, res) => {
  const { availabilityId } = req.params;
  const { startTime, endTime, maxBookings } = req.body;
  
  if (!availabilityId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(ApiResponse.error('Invalid availability ID format'));
  }
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (startTime && !timeRegex.test(startTime)) {
    return res.status(400).json(ApiResponse.error('Start time must be in HH:MM format'));
  }
  
  if (endTime && !timeRegex.test(endTime)) {
    return res.status(400).json(ApiResponse.error('End time must be in HH:MM format'));
  }
  
  if (maxBookings && (maxBookings < 1 || maxBookings > 100)) {
    return res.status(400).json(ApiResponse.error('Max bookings must be between 1 and 100'));
  }
  
  const result = await availabilityService.updateAvailability(availabilityId, req.body);
  res.status(200).json(ApiResponse.success(result, 'Availability updated successfully'));
});

/**
 * DELETE - Delete availability
 * DELETE /api/availability/:availabilityId
 */
export const deleteAvailability = asyncHandler(async (req, res) => {
  const { availabilityId } = req.params;
  
  if (!availabilityId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(ApiResponse.error('Invalid availability ID format'));
  }
  
  const result = await availabilityService.deleteAvailability(availabilityId);
  res.status(200).json(ApiResponse.success(result, result.message));
});

/**
 * DELETE - Bulk delete availability
 * DELETE /api/availability/bulk?providerId=&startDate=&endDate=
 */
export const bulkDeleteAvailability = asyncHandler(async (req, res) => {
  const { providerId, startDate, endDate } = req.query;
  
  if (!providerId) {
    return res.status(400).json(ApiResponse.error('Provider ID is required'));
  }
  
  if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(ApiResponse.error('Invalid provider ID format'));
  }
  
  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json(ApiResponse.error('Invalid start date format'));
  }
  
  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json(ApiResponse.error('Invalid end date format'));
  }
  
  const result = await availabilityService.bulkDeleteAvailability(providerId, startDate, endDate);
  res.status(200).json(ApiResponse.success(result, result.message));
});