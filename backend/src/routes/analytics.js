import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getSalesAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
  getOrderAnalytics,
  getRevenueAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(admin);

router.get('/sales', getSalesAnalytics);
router.get('/products', getProductAnalytics);
router.get('/customers', getCustomerAnalytics);
router.get('/orders', getOrderAnalytics);
router.get('/revenue', getRevenueAnalytics);

export default router; 