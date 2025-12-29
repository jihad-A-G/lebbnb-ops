import { Router } from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
  replyToContact
} from '../controllers/contact.controller';
import { contactValidation } from '../middleware/validation';
import { handleValidationErrors, asyncHandler } from '../middleware/errorHandler';
import { contactLimiter, adminLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

// Public route
router.post(
  '/',
  contactLimiter,
  contactValidation.create,
  handleValidationErrors,
  asyncHandler(createContact)
);

// Admin routes (protected)
router.get(
  '/admin',
  authenticate,
  adminLimiter,
  asyncHandler(getAllContacts)
);

router.get(
  '/admin/stats',
  authenticate,
  adminLimiter,
  asyncHandler(getContactStats)
);

router.get(
  '/admin/:id',
  authenticate,
  adminLimiter,
  contactValidation.getById,
  handleValidationErrors,
  asyncHandler(getContactById)
);

router.patch(
  '/admin/:id/status',
  authenticate,
  adminLimiter,
  contactValidation.updateStatus,
  handleValidationErrors,
  asyncHandler(updateContactStatus)
);

router.post(
  '/admin/:id/reply',
  authenticate,
  adminLimiter,
  [
    contactValidation.getById[0], // ID validation
    body('reply')
      .trim()
      .notEmpty().withMessage('Reply message is required')
      .isLength({ max: 2000 }).withMessage('Reply cannot exceed 2000 characters')
  ],
  handleValidationErrors,
  asyncHandler(replyToContact)
);

router.delete(
  '/admin/:id',
  authenticate,
  adminLimiter,
  contactValidation.getById,
  handleValidationErrors,
  asyncHandler(deleteContact)
);

export default router;
