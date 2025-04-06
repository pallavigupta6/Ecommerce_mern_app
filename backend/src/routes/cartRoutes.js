import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  addToCart,
  updateCartItem,
  applyCoupon,
  getCart
} from '../controllers/cartController.js';

const router = express.Router();

router.use(protect); // Protect all cart routes

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.post('/apply-coupon', applyCoupon);

export default router;