import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import User from '../models/User.js';

// Middleware: Protect Routes (Check JWT)
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(createError(401, 'Not authorized, no token'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return next(createError(401, 'Not authorized, token failed'));
    }
  } catch (error) {
    next(error);
  }
};

// Middleware: Admin Check
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(createError(403, 'Not authorized as admin'));
  }
};

// Middleware: Vendor Check
export const vendor = (req, res, next) => {
  if (req.user && req.user.isVendor) { // Ensure `isVendor` exists in User model
    next();
  } else {
    next(createError(403, 'Not authorized as vendor'));
  }
};
