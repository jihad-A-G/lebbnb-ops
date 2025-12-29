import { Router } from 'express';
import {
  getAbout,
  updateAbout,
  uploadAboutImages,
  deleteAboutImage
} from '../controllers/about.controller';
import { aboutValidation } from '../middleware/validation';
import { handleValidationErrors, asyncHandler } from '../middleware/errorHandler';
import { upload } from '../config/multer';
import { adminLimiter, uploadLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public route
router.get(
  '/',
  asyncHandler(getAbout)
);

// Admin routes (protected)
router.put(
  '/admin',
  authenticate,
  adminLimiter,
  aboutValidation.update,
  handleValidationErrors,
  asyncHandler(updateAbout)
);

router.post(
  '/admin/upload',
  authenticate,
  uploadLimiter,
  upload.array('images', 10),
  asyncHandler(uploadAboutImages)
);

router.delete(
  '/admin/image/:filename',
  authenticate,
  adminLimiter,
  asyncHandler(deleteAboutImage)
);

export default router;
