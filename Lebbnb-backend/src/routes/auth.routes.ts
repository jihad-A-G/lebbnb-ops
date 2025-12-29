import express from 'express';
import { body } from 'express-validator';
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  getCurrentAdmin,
  changePassword,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/errorHandler';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for login attempts (stricter)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration (very strict)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route   POST /api/auth/register
 * @desc    Register new admin (superadmin only or initial setup)
 * @access  Private (Superadmin only)
 */
router.post(
  '/register',
  registerLimiter,
  // authenticate, // Uncomment this after creating first admin
  // restrictToSuperAdmin, // Uncomment this after creating first admin
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('role')
      .optional()
      .isIn(['admin', 'superadmin'])
      .withMessage('Invalid role'),
  ],
  handleValidationErrors,
  registerAdmin
);

/**
 * @route   POST /api/auth/login
 * @desc    Login admin
 * @access  Public
 */
router.post(
  '/login',
  loginLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  loginAdmin
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout admin
 * @access  Private
 */
router.post('/logout', authenticate, logoutAdmin);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires refresh token)
 */
router.post('/refresh', refreshAccessToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current admin profile
 * @access  Private
 */
router.get('/me', authenticate, getCurrentAdmin);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change admin password
 * @access  Private
 */
router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage(
        'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  ],
  handleValidationErrors,
  changePassword
);

export default router;
