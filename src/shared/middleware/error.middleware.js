import { ApiResponse, AppError } from "../utils/helpers.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : "Something went wrong. Please try again later.";
  const details = err.isOperational ? err.details || null : null;

  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json(
      ApiResponse.error(
        message,
        {
          name: err.name,
          details,
          stack: err.stack,
        },
        statusCode,
      ),
    );
  }

  res.status(statusCode).json(ApiResponse.error(message, details, statusCode));
};
