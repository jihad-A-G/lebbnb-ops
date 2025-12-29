import { Router } from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  deletePropertyImage
} from '../controllers/property.controller';
import { propertyValidation } from '../middleware/validation';
import { handleValidationErrors, asyncHandler } from '../middleware/errorHandler';
import { upload } from '../config/multer';
import { adminLimiter, uploadLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get(
  '/',
  propertyValidation.getAll,
  handleValidationErrors,
  asyncHandler(getAllProperties)
);

router.get(
  '/:id',
  propertyValidation.getById,
  handleValidationErrors,
  asyncHandler(getPropertyById)
);

// Admin routes (protected)
router.post(
  '/admin',
  authenticate,
  adminLimiter,
  propertyValidation.create,
  handleValidationErrors,
  asyncHandler(createProperty)
);

router.put(
  '/admin/:id',
  authenticate,
  adminLimiter,
  propertyValidation.update,
  handleValidationErrors,
  asyncHandler(updateProperty)
);

router.delete(
  '/admin/:id',
  authenticate,
  adminLimiter,
  propertyValidation.getById,
  handleValidationErrors,
  asyncHandler(deleteProperty)
);

router.post(
  '/admin/:id/upload',
  authenticate,
  uploadLimiter,
  propertyValidation.getById,
  handleValidationErrors,
  upload.array('images', 100),
  asyncHandler(uploadPropertyImages)
);

router.delete(
  '/admin/:id/image/:filename',
  authenticate,
  adminLimiter,
  asyncHandler(deletePropertyImage)
);

export default router;
