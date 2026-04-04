import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { AppError, catchAsync } from '../utils/helpers.js';
export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new AppError('You are not logged in. Please log in to access this resource.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    if (!user) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    // Check if password was changed after token was issued
    if (user.passwordChangedAt) {
    const changedAt = new Date(user.passwordChangedAt);
      const changedTimestamp = Math.floor(changedAt.getTime() / 1000);
      if (decoded.iat < changedTimestamp) {
        throw new AppError('Password recently changed. Please log in again.', 401);
      }
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired. Please log in again.', 401);
    }
    throw error;
  }
});
