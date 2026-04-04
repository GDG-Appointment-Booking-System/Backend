import logger from './logger.js';
export class ApiResponse {
  constructor(success = true, message = '', data = null, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static success(data = null, message = 'Success', statusCode = 200) {
    return new ApiResponse(true, message, data, statusCode);
  }

  static error(message = 'Error', data = null, statusCode = 400) {
    return new ApiResponse(false, message, data, statusCode);
  }
}

// GENERAL APP ERROR
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
    logger.error(`${statusCode} - ${message}`);
  }
}

// GENERAL ASYNC HANLDER
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateTime = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const isValidDate = (date) => !isNaN(new Date(date).getTime());

export const isPastDate = (date) => new Date(date) < new Date();

export const isOverlapping = (start1, end1, start2, end2) =>
  start1 < end2 && start2 < end1;

export const generateTimeSlots = (startTime, endTime, slotDuration = 30) => {
  const slots = [];
  let current = new Date(startTime);
  const end = new Date(endTime);
  while (current < end) {
    const slotEnd = new Date(current.getTime() + slotDuration * 60000);
    slots.push({ start: new Date(current), end: slotEnd });
    current = slotEnd;
  }
  return slots;
};

export const paginate = (query, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

export const scheduleReminder = (appointmentDate, callback) => {
  const delay = new Date(appointmentDate) - new Date();
  if (delay > 0) {
    setTimeout(callback, delay);
  }
};
