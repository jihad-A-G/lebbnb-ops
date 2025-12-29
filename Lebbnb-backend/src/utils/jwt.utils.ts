import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

// Get JWT secrets from environment
const getAccessTokenSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
  }
  return secret;
};

const getRefreshTokenSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }
  return secret;
};

// Generate access token (short-lived)
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getAccessTokenSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m', // 15 minutes default
    issuer: 'lebbnb-admin',
    audience: 'lebbnb-api',
  } as jwt.SignOptions);
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getRefreshTokenSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d', // 7 days default
    issuer: 'lebbnb-admin',
    audience: 'lebbnb-api',
  } as jwt.SignOptions);
};

// Verify access token
export const verifyAccessToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, getAccessTokenSecret(), {
      issuer: 'lebbnb-admin',
      audience: 'lebbnb-api',
    }) as DecodedToken;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, getRefreshTokenSecret(), {
      issuer: 'lebbnb-admin',
      audience: 'lebbnb-api',
    }) as DecodedToken;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};


