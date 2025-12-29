import { Router } from 'express';
import {
  getHome,
  updateHome,
  uploadHeroImage,
  uploadSectionImage,
  uploadTestimonialImage
} from '../controllers/home.controller';
import { homeValidation } from '../middleware/validation';
import { handleValidationErrors, asyncHandler } from '../middleware/errorHandler';
import { upload } from '../config/multer';
import { adminLimiter, uploadLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public route
router.get(
  '/',
  asyncHandler(getHome)
);

// Admin routes (protected)
router.put(
  '/admin',
  authenticate,
  adminLimiter,
  homeValidation.update,
  handleValidationErrors,
  asyncHandler(updateHome)
);

router.post(
  '/admin/hero-image',
  authenticate,
  uploadLimiter,
  upload.single('image'),
  asyncHandler(uploadHeroImage)
);

router.post(
  '/admin/section/:sectionIndex/image',
  authenticate,
  uploadLimiter,
  upload.single('image'),
  asyncHandler(uploadSectionImage)
);

router.post(
  '/admin/testimonial/:testimonialIndex/image',
  authenticate,
  uploadLimiter,
  upload.single('image'),
  asyncHandler(uploadTestimonialImage)
);

export default router;
