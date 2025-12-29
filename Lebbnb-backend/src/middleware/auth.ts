import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import Admin from '../models/Admin.model';

// Extend Request interface to include admin property
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to verify JWT token and authenticate admin
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header only
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      });
      return;
    }

    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Admin account not found',
      });
      return;
    }

    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
      return;
    }

    // Check if password was changed after token was issued
    if (admin.passwordChangedAt) {
      const passwordChangedTimestamp = Math.floor(admin.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < passwordChangedTimestamp) {
        res.status(401).json({
          success: false,
          message: 'Password was changed. Please login again.',
        });
        return;
      }
    }

    // Attach admin info to request
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    next(error);
  }
};

/**
 * Middleware to restrict access to superadmin only
 */
export const restrictToSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.admin?.role !== 'superadmin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Superadmin privileges required.',
    });
    return;
  }
  next();
};

/**
 * Middleware to restrict access to admin and superadmin
 */
export const restrictToAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.admin || !['admin', 'superadmin'].includes(req.admin.role)) {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
    return;
  }
  next();
};
