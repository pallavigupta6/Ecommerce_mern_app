import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('mobileNumber')
    .matches(/^\+?[1-9]\d{9,11}$/)
    .withMessage('Please enter a valid mobile number'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please enter a valid date'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);
router.post('/create/admin', registerValidation, authController.createAdmin)


export default router;