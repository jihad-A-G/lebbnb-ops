# Authentication System Documentation

## Overview
This authentication system provides secure admin access using JWT (JSON Web Tokens) and bcrypt encryption, following modern security best practices.

## Security Features

### 1. **Password Security**
- **Bcrypt Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

### 2. **JWT Token Management**
- **Access Token**: Short-lived (15 minutes) for API authentication
- **Refresh Token**: Long-lived (7 days) for obtaining new access tokens
- **HttpOnly Cookies**: Tokens stored in httpOnly cookies to prevent XSS attacks
- **Secure Flag**: Enabled in production for HTTPS-only transmission
- **SameSite**: Set to 'strict' for CSRF protection

### 3. **Account Security**
- **Account Lockout**: After 5 failed login attempts, account locks for 2 hours
- **Active Status Check**: Deactivated accounts cannot authenticate
- **Password Change Detection**: Tokens invalidated when password changes
- **Last Login Tracking**: Monitors when admin last accessed the system

### 4. **Rate Limiting**
- **Login Endpoint**: 5 attempts per 15 minutes per IP
- **Register Endpoint**: 3 attempts per hour per IP
- **General API**: Rate limiting on all API endpoints

## Environment Variables

Add these to your `.env` file:

\`\`\`env
# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
\`\`\`

**IMPORTANT**: Generate secure secrets using:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

## API Endpoints

### 1. Register Admin (POST `/api/auth/register`)
Register a new admin account.

**Note**: For initial setup, this endpoint is open. After creating the first admin, uncomment the authentication middleware in `auth.routes.ts` to restrict access to superadmin only.

**Request Body**:
\`\`\`json
{
  "email": "admin@example.com",
  "password": "SecureP@ss123",
  "name": "Admin Name",
  "role": "admin" // or "superadmin"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "id": "admin_id",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
\`\`\`

### 2. Login (POST `/api/auth/login`)
Authenticate and receive access/refresh tokens.

**Request Body**:
\`\`\`json
{
  "email": "admin@example.com",
  "password": "SecureP@ss123"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "admin_id",
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "admin",
      "lastLogin": "2025-12-13T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

**Cookies Set**: `accessToken`, `refreshToken`

### 3. Logout (POST `/api/auth/logout`)
Clear authentication tokens.

**Headers**: `Authorization: Bearer <access_token>` or Cookie

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Logout successful"
}
\`\`\`

### 4. Refresh Token (POST `/api/auth/refresh`)
Get a new access token using refresh token.

**Request Body** (optional if cookie is set):
\`\`\`json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

### 5. Get Current Admin (GET `/api/auth/me`)
Get authenticated admin's profile.

**Headers**: `Authorization: Bearer <access_token>` or Cookie

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "admin_id",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin",
    "isActive": true,
    "lastLogin": "2025-12-13T10:30:00.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
\`\`\`

### 6. Change Password (PUT `/api/auth/change-password`)
Change admin password (requires re-login).

**Headers**: `Authorization: Bearer <access_token>` or Cookie

**Request Body**:
\`\`\`json
{
  "currentPassword": "OldP@ss123",
  "newPassword": "NewSecureP@ss456"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Password changed successfully. Please login again."
}
\`\`\`

## Protecting Routes

### Using Authentication Middleware

To protect any route, add the `authenticate` middleware:

\`\`\`typescript
import { authenticate } from '../middleware/auth';

router.get('/protected-route', authenticate, controller);
\`\`\`

### Role-Based Access Control

For superadmin-only routes:
\`\`\`typescript
import { authenticate, restrictToSuperAdmin } from '../middleware/auth';

router.delete('/admin/:id', authenticate, restrictToSuperAdmin, controller);
\`\`\`

For admin and superadmin routes:
\`\`\`typescript
import { authenticate, restrictToAdmin } from '../middleware/auth';

router.post('/create', authenticate, restrictToAdmin, controller);
\`\`\`

## Usage Examples

### Example: Protecting Property Routes

\`\`\`typescript
// In property.routes.ts
import { authenticate } from '../middleware/auth';

// Public routes (read-only)
router.get('/', getProperties);
router.get('/:id', getProperty);

// Protected routes (admin only)
router.post('/', authenticate, createProperty);
router.put('/:id', authenticate, updateProperty);
router.delete('/:id', authenticate, deleteProperty);
\`\`\`

### Example: Client-Side Authentication Flow

\`\`\`javascript
// Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Make authenticated request
const createProperty = async (propertyData) => {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify(propertyData)
  });
  
  // If 401, try to refresh token
  if (response.status === 401) {
    await refreshToken();
    return createProperty(propertyData); // Retry
  }
  
  return response.json();
};

// Refresh token
const refreshToken = async () => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include'
  });
  return response.json();
};
\`\`\`

## Initial Setup Steps

1. **Copy environment variables**:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. **Generate secure JWT secrets**:
   \`\`\`bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   \`\`\`
   Update `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `.env`

3. **Start the server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Create first admin** (while registration is open):
   \`\`\`bash
   curl -X POST http://localhost:5000/api/auth/register \\
     -H "Content-Type: application/json" \\
     -d '{
       "email": "admin@lebbnb.com",
       "password": "SecureP@ss123",
       "name": "Super Admin",
       "role": "superadmin"
     }'
   \`\`\`

5. **Secure registration endpoint**:
   - Open `src/routes/auth.routes.ts`
   - Uncomment `authenticate` and `restrictToSuperAdmin` middlewares on the register route
   - Save the file

6. **Test login**:
   \`\`\`bash
   curl -X POST http://localhost:5000/api/auth/login \\
     -H "Content-Type: application/json" \\
     -d '{
       "email": "admin@lebbnb.com",
       "password": "SecureP@ss123"
     }'
   \`\`\`

## Security Best Practices Implemented

✅ **Password Hashing**: Bcrypt with 12 rounds  
✅ **Token Expiration**: Short-lived access tokens  
✅ **HttpOnly Cookies**: XSS protection  
✅ **CSRF Protection**: SameSite cookie attribute  
✅ **Rate Limiting**: Brute force protection  
✅ **Account Lockout**: After failed attempts  
✅ **Secure in Production**: HTTPS-only cookies  
✅ **Token Invalidation**: On password change  
✅ **Input Validation**: Using express-validator  
✅ **NoSQL Injection Protection**: Using mongo-sanitize  
✅ **Role-Based Access**: Admin and superadmin roles

## Troubleshooting

### "JWT_ACCESS_SECRET is not defined"
Make sure you have created a `.env` file and added the JWT secrets.

### "Account is locked"
Wait 2 hours or manually reset `loginAttempts` and `lockUntil` in the database.

### "Invalid or expired token"
Request a new token using the refresh endpoint or login again.

### Cookies not being set
Ensure `credentials: 'include'` is set in fetch requests and CORS is configured properly.

## Additional Recommendations

1. **HTTPS in Production**: Always use HTTPS in production
2. **Environment-Specific Secrets**: Use different secrets for dev/staging/production
3. **Secret Management**: Use AWS Secrets Manager, Azure Key Vault, or similar
4. **Logging**: Add audit logging for authentication events
5. **2FA**: Consider implementing two-factor authentication for additional security
6. **IP Whitelisting**: For very sensitive operations
7. **Session Management**: Track active sessions per admin
8. **Regular Security Audits**: Review and update security measures regularly
