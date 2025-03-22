import rateLimit from 'express-rate-limit';

// Rate limiter for OTP requests
export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many OTP requests. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for OTP verification
export const verifyRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 attempts per window
  message: 'Too many verification attempts. Please try again after 5 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
}); 