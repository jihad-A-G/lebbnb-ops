import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import dotenv from 'dotenv';

// Import routes
import propertyRoutes from './routes/property.routes';
import contactRoutes from './routes/contact.routes';
import aboutRoutes from './routes/about.routes';
import homeRoutes from './routes/home.routes';
import authRoutes from './routes/auth.routes';

// Import middleware
import { apiLimiter } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();

// Trust proxy - important for rate limiting and getting correct IP
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS middleware
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in allowed origins
    if (allowedOrigins.some(allowedOrigin => allowedOrigin === origin || allowedOrigin === '*')) {
      callback(null, true);
    } else {
      // Still allow but log the warning
      console.warn(`CORS Warning: Origin ${origin} is not in allowed origins list`);
      callback(null, true); // Allow anyway to prevent blocking
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parser middleware with increased timeout for large uploads
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Set server timeout for long-running requests (10 minutes)
// This ensures Node.js doesn't kill the connection during large uploads
app.use((req: Request, res: Response, next: NextFunction) => {
  // Set timeout to 10 minutes (600000ms)
  req.setTimeout(600000);
  res.setTimeout(600000);
  next();
});

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/home', homeRoutes);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Rental Company API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      properties: '/api/properties',
      contact: '/api/contact',
      about: '/api/about',
      home: '/api/home'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.stack);
  
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({
      status: 'error',
      message: 'File size is too large. Maximum size is 5MB.'
    });
    return;
  }
  
  // Multer file count error
  if (err.code === 'LIMIT_FILE_COUNT') {
    res.status(400).json({
      status: 'error',
      message: 'Too many files. Maximum is 10 files.'
    });
    return;
  }
  
  // Multer unexpected field error
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400).json({
      status: 'error',
      message: 'Unexpected file field.'
    });
    return;
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: Object.values(err.errors).map((e: any) => e.message)
    });
    return;
  }
  
  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    res.status(400).json({
      status: 'error',
      message: 'Invalid ID format'
    });
    return;
  }
  
  // Default error response
  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

export default app;
