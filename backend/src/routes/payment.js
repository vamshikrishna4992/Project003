import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createPaymentIntent,
  createPaymentMethod,
  getPaymentMethods,
  deletePaymentMethod,
  processRefund,
  getPaymentHistory,
  handleWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

// Protected routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/create-payment-method', protect, createPaymentMethod);
router.get('/payment-methods', protect, getPaymentMethods);
router.delete('/payment-methods/:id', protect, deletePaymentMethod);
router.get('/history', protect, getPaymentHistory);

// Admin routes
router.post('/refund', protect, admin, processRefund);

// Webhook route (no auth required)
router.post('/webhook', handleWebhook);

export default router; 