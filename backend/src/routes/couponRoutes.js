import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin')); // All coupon routes are admin only

router.post('/', createCoupon);
router.get('/', getCoupons);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;