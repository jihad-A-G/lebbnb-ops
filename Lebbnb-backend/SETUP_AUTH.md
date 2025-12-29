# Admin Authentication Quick Start Guide

## Initial Setup

### 1. Configure Environment Variables

Create a `.env` file from the example:
\`\`\`bash
cp .env.example .env
\`\`\`

Generate secure JWT secrets:
\`\`\`bash
node -e "console.log('JWT_ACCESS_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

Add these to your `.env` file.

### 2. Build the TypeScript Code

\`\`\`bash
npm run build
\`\`\`

### 3. Create Your First Admin

**Option A: Using the setup script (Recommended)**
\`\`\`bash
node scripts/createAdmin.js
\`\`\`

Follow the prompts to create your first superadmin account.

**Option B: Using API request**
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

### 4. Secure the Registration Endpoint

After creating your first admin:

1. Open `src/routes/auth.routes.ts`
2. Find the register route (around line 41)
3. Uncomment these two lines:
   \`\`\`typescript
   authenticate, // Uncomment this
   restrictToSuperAdmin, // Uncomment this
   \`\`\`

This ensures only authenticated superadmins can create new admins.

## Testing Authentication

### 1. Login
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -c cookies.txt \\
  -d '{
    "email": "admin@lebbnb.com",
    "password": "SecureP@ss123"
  }'
\`\`\`

Save the `accessToken` from the response.

### 2. Access Protected Route
\`\`\`bash
# Using cookie
curl -X GET http://localhost:5000/api/auth/me \\
  -b cookies.txt

# Or using Bearer token
curl -X GET http://localhost:5000/api/auth/me \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
\`\`\`

### 3. Create a Property (Protected Route)
\`\`\`bash
curl -X POST http://localhost:5000/api/properties/admin \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -d '{
    "title": "Beautiful Villa",
    "address": "123 Beach Road, Paradise City"
  }'
\`\`\`

## Password Requirements

Passwords must:
- Be at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number
- Contain at least one special character (@$!%*?&)

Example valid passwords:
- `SecureP@ss123`
- `MyP@ssw0rd!`
- `Admin$2024Pass`

## Protected Endpoints

All admin routes now require authentication. The following routes are protected:

### Properties
- POST `/api/properties/admin` - Create property
- PUT `/api/properties/admin/:id` - Update property
- DELETE `/api/properties/admin/:id` - Delete property
- POST `/api/properties/admin/:id/upload` - Upload images
- DELETE `/api/properties/admin/:id/image/:filename` - Delete image

### Contacts
- GET `/api/contact/admin` - Get all contacts
- GET `/api/contact/admin/stats` - Get contact stats
- GET `/api/contact/admin/:id` - Get contact by ID
- PATCH `/api/contact/admin/:id/status` - Update contact status
- DELETE `/api/contact/admin/:id` - Delete contact

### About
- PUT `/api/about/admin` - Update about page
- POST `/api/about/admin/upload` - Upload images
- DELETE `/api/about/admin/image/:filename` - Delete image

### Home
- PUT `/api/home/admin` - Update home page
- POST `/api/home/admin/hero-image` - Upload hero image
- POST `/api/home/admin/section/:sectionIndex/image` - Upload section image
- POST `/api/home/admin/testimonial/:testimonialIndex/image` - Upload testimonial image

## Common Issues

### "JWT_ACCESS_SECRET is not defined"
- Make sure `.env` file exists and contains JWT secrets
- Restart the server after updating `.env`

### "Authentication required. No token provided."
- Include token in Authorization header: `Authorization: Bearer <token>`
- Or ensure cookies are being sent with requests

### "Account is locked"
- Wait 2 hours or manually reset in database
- Use MongoDB Compass to reset `loginAttempts` and remove `lockUntil`

### "Invalid or expired token"
- Access tokens expire after 15 minutes
- Use refresh token endpoint to get new access token
- Or login again

## Next Steps

1. ✅ Build and start your application: `npm run dev`
2. ✅ Create your first admin using the script
3. ✅ Test login and access to protected routes
4. ✅ Secure the registration endpoint
5. ✅ Update your frontend to use the authentication system

For detailed documentation, see [AUTH_DOCUMENTATION.md](AUTH_DOCUMENTATION.md)
