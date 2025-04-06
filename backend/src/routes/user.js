import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Profile management
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);

// Admin only routes
router.get('/all', restrictTo('admin'), userController.getAllUsers);

export default router;