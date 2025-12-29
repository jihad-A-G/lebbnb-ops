import { body, param, query } from 'express-validator';

// Gallery validation rules
export const propertyValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('address')
      .trim()
      .notEmpty().withMessage('Address is required')
      .isLength({ max: 300 }).withMessage('Address cannot exceed 300 characters')
  ],
  
  update: [
    param('id').isMongoId().withMessage('Invalid gallery item ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 300 }).withMessage('Address cannot exceed 300 characters')
  ],
  
  getById: [
    param('id').isMongoId().withMessage('Invalid gallery item ID')
  ],
  
  getAll: [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ]
};

// Contact validation rules
export const contactValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .isLength({ max: 20 }).withMessage('Phone cannot exceed 20 characters'),
    body('subject')
      .trim()
      .notEmpty().withMessage('Subject is required')
      .isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters')
  ],
  
  updateStatus: [
    param('id').isMongoId().withMessage('Invalid contact ID'),
    body('status')
      .isIn(['new', 'read', 'replied']).withMessage('Invalid status')
  ],
  
  getById: [
    param('id').isMongoId().withMessage('Invalid contact ID')
  ]
};

// About validation rules
export const aboutValidation = {
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('subtitle')
      .optional()
      .trim()
      .isLength({ max: 300 }).withMessage('Subtitle cannot exceed 300 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
    body('mission')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Mission cannot exceed 1000 characters'),
    body('vision')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Vision cannot exceed 1000 characters'),
    body('values')
      .optional()
      .isArray().withMessage('Values must be an array'),
    body('teamMembers')
      .optional()
      .isArray().withMessage('Team members must be an array'),
    body('companyStats')
      .optional()
      .isArray().withMessage('Company stats must be an array')
  ]
};

// Home validation rules
export const homeValidation = {
  update: [
    body('heroTitle')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Hero title cannot exceed 200 characters'),
    body('heroSubtitle')
      .optional()
      .trim()
      .isLength({ max: 300 }).withMessage('Hero subtitle cannot exceed 300 characters'),
    body('heroDescription')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Hero description cannot exceed 1000 characters'),
    body('heroCtaText')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('CTA text cannot exceed 50 characters'),
    body('sections')
      .optional()
      .isArray().withMessage('Sections must be an array'),
    body('testimonials')
      .optional()
      .isArray().withMessage('Testimonials must be an array'),
    body('stats')
      .optional()
      .isArray().withMessage('Stats must be an array')
  ]
};
