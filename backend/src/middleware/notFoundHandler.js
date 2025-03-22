import { createError } from '../utils/error.js';

export const notFoundHandler = (req, res, next) => {
  next(createError(404, `Not Found - ${req.originalUrl}`));
}; 