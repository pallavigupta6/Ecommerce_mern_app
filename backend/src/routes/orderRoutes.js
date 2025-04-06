import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  getDashboardStats
} from '../controllers/orderController.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);

// Admin only routes
router.use(restrictTo('admin'));
router.put('/:id/status', updateOrderStatus);
router.get('/dashboard/stats', getDashboardStats);

export default router;