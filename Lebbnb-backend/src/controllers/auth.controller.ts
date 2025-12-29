import { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.utils';

/**
 * Register a new admin (Only for initial setup or by superadmin)
 * In production, this should be restricted to superadmin only
 */
export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      res.status(409).json({
        success: false,
        message: 'Admin with this email already exists',
      });
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        success: false,
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
      return;
    }

    // Create new admin
    const admin = new Admin({
      email,
      password,
      name,
      role: role || 'admin',
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Login admin
 */
export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find admin and include password field
    const admin = await Admin.findOne({ email }).select('+password +refreshToken');

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Check if account is locked
    if (admin.isLocked()) {
      res.status(423).json({
        success: false,
        message: 'Account is locked due to too many failed login attempts. Please try again later.',
      });
      return;
    }

    // Check if account is active
    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.',
      });
      return;
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await admin.incLoginAttempts();

      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0) {
      await admin.resetLoginAttempts();
    }

    // Generate tokens
    const tokenPayload = {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token to database
    admin.refreshToken = refreshToken;
    admin.lastLogin = new Date();
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          lastLogin: admin.lastLogin,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Logout admin
 */
export const logoutAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = (req as any).admin?.id;

    if (adminId) {
      // Clear refresh token from database
      await Admin.findByIdAndUpdate(adminId, {
        $unset: { refreshToken: 1 },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token not provided',
      });
      return;
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
      return;
    }

    // Find admin and verify refresh token matches
    const admin = await Admin.findById(decoded.id).select('+refreshToken');

    if (!admin || admin.refreshToken !== refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
      return;
    }

    // Check if account is active
    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
      return;
    }

    // Generate new tokens
    const tokenPayload = {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Update refresh token in database
    admin.refreshToken = newRefreshToken;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Get current admin profile
 */
export const getCurrentAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = (req as any).admin?.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Change password
 */
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = (req as any).admin?.id;
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId).select('+password');

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
      return;
    }

    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long',
      });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      res.status(400).json({
        success: false,
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
      return;
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    // Clear refresh token (force re-login)
    admin.refreshToken = undefined;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please login again.',
    });
  } catch (error: any) {
    next(error);
  }
};
