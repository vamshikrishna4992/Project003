import express from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getReviewById
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/:id', getReviewById);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin routes
router.delete('/:id', protect, admin, deleteReview);

export default router; 