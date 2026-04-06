import * as appointmentService from './appointment.service.js';
import { asyncHandler, ApiResponse } from '../../shared/utils/helpers.js';
// Controller functions for appointment routes
export const createAppointment = asyncHandler(async (req, res) => {
  const result = await appointmentService.createAppointment(req.body);
  res.status(201).json(ApiResponse.success(result, 'Appointment created successfully', 201));
});
// Get all appointments with optional filters (date range, provider, user)
export const getAllAppointments = asyncHandler(async (req, res) => {
  const result = await appointmentService.getAllAppointments(req.query);
  res.status(200).json(ApiResponse.success(result, 'Appointments retrieved successfully'));
});
// Get appointment by ID
export const getAppointmentById = asyncHandler(async (req, res) => {
  const result = await appointmentService.getAppointmentById(req.params.appointmentId);
  res.status(200).json(ApiResponse.success(result, 'Appointment retrieved successfully'));
});
// Get appointments for a specific user
export const getUserAppointments = asyncHandler(async (req, res) => {
  const result = await appointmentService.getAppointmentsByUser(req.params.userId, req.query);
  res.status(200).json(ApiResponse.success(result, 'User appointments retrieved successfully'));
});
// Get appointments for a specific provider
export const getProviderAppointments = asyncHandler(async (req, res) => {
  const result = await appointmentService.getAppointmentsByProvider(req.params.providerId, req.query);
  res.status(200).json(ApiResponse.success(result, 'Provider appointments retrieved successfully'));
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const result = await appointmentService.updateAppointment(req.params.appointmentId, req.body);
  res.status(200).json(ApiResponse.success(result, 'Appointment updated successfully'));
});

export const confirmAppointment = asyncHandler(async (req, res) => {
  const result = await appointmentService.confirmAppointment(req.params.appointmentId);
  res.status(200).json(ApiResponse.success(result, 'Appointment confirmed successfully'));
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const result = await appointmentService.cancelAppointment(req.params.appointmentId, req.body.reason);
  res.status(200).json(ApiResponse.success(result, 'Appointment cancelled successfully'));
});

export const completeAppointment = asyncHandler(async (req, res) => {
  const result = await appointmentService.completeAppointment(req.params.appointmentId);
  res.status(200).json(ApiResponse.success(result, 'Appointment completed successfully'));
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const result = await appointmentService.deleteAppointment(req.params.appointmentId);
  res.status(200).json(ApiResponse.success(result, result.message));
});