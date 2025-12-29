# Deployment Guide for Lebbnb Backend

## Deploy to Render.com

### Prerequisites
- GitHub account
- Render.com account
- MongoDB Atlas database (or other cloud MongoDB)

### Step 1: Push Code to GitHub

1. **Initialize Git repository (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a new repository on GitHub** and push your code:
   ```bash
   git remote add origin https://github.com/yourusername/lebbnb-backend.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set up MongoDB Atlas (if not already done)

Your current connection string shows you're already using MongoDB Atlas:
```
mongodb+srv://jihad:PakoH1AB7NktreEk@cluster0.lb10hkq.mongodb.net/Lebbnb
```

Make sure to:
- Whitelist all IPs (0.0.0.0/0) in Network Access for Render deployment
- Keep your connection string handy

### Step 3: Deploy on Render

#### Option A: Using render.yaml (Recommended)

1. **Connect GitHub repository to Render:**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

2. **Set Environment Variables:**
   Render will prompt you to set these variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `CORS_ORIGIN`: Your frontend URL (e.g., https://your-frontend.com)
   - `GMAIL_USER`: jihadabdlghani@gmail.com
   - `GMAIL_APP_PASSWORD`: tedroawbdywpdfyj

3. **Deploy:**
   - Click "Apply" to create the service
   - Render will automatically build and deploy your app

#### Option B: Manual Setup

1. **Create New Web Service:**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service:**
   - **Name**: lebbnb-backend
   - **Runtime**: Docker
   - **Branch**: main
   - **Dockerfile Path**: ./Dockerfile

3. **Set Environment Variables:**
   Go to "Environment" tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://jihad:PakoH1AB7NktreEk@cluster0.lb10hkq.mongodb.net/Lebbnb?appName=Cluster0
   CORS_ORIGIN=https://your-frontend-url.com
   JWT_ACCESS_SECRET=<generate-random-64-char-string>
   JWT_REFRESH_SECRET=<generate-different-random-64-char-string>
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   GMAIL_USER=jihadabdlghani@gmail.com
   GMAIL_APP_PASSWORD=tedroawbdywpdfyj
   COMPANY_NAME=Lebbnb
   ```

   **Generate secure JWT secrets:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Run this twice to get two different secrets.

4. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy your application

### Step 4: Verify Deployment

1. **Check Health Endpoint:**
   ```bash
   curl https://your-app-name.onrender.com/health
   ```

2. **Test Login:**
   ```bash
   curl -X POST https://your-app-name.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@lebbnb.com","password":"admin@bnb123"}'
   ```

### Step 5: Create First Admin (if needed)

If you need to create the first admin on the deployed database:

1. **Connect to Render Shell:**
   - Go to your service on Render dashboard
   - Click "Shell" tab
   - Run: `node scripts/addDefaultAdmin.js`

Or use the API directly (before securing the registration endpoint):
```bash
curl -X POST https://your-app-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lebbnb.com",
    "password": "SecureP@ss123",
    "name": "Admin",
    "role": "superadmin"
  }'
```

## Local Development with Docker

### Using Docker Compose

1. **Build and start services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f api
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

### Using Docker Only

1. **Build the image:**
   ```bash
   docker build -t lebbnb-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -p 5000:5000 \
     -e MONGODB_URI="your-mongodb-uri" \
     -e JWT_ACCESS_SECRET="your-secret" \
     -e JWT_REFRESH_SECRET="your-secret" \
     lebbnb-backend
   ```

## Important Security Notes

### Before Deploying to Production:

1. **Generate Strong JWT Secrets:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Use different secrets for ACCESS and REFRESH tokens.

2. **Update CORS Origin:**
   Set `CORS_ORIGIN` to your actual frontend URL.

3. **Secure Registration Endpoint:**
   In `src/routes/auth.routes.ts`, uncomment the authentication middleware:
   ```typescript
   router.post(
     '/register',
     registerLimiter,
     authenticate, // Uncomment this
     restrictToSuperAdmin, // Uncomment this
     // ... rest of the code
   ```

4. **Whitelist Render IPs in MongoDB Atlas:**
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (all IPs)
   - Or whitelist specific Render IPs if available

5. **Enable Gmail Less Secure Apps** (if needed):
   - Or better: Use Gmail App Password (already configured)

## Monitoring

### Render Dashboard
- Check logs in real-time
- Monitor CPU and memory usage
- View deployment history

### Health Check
Your app includes a health check endpoint at `/health`:
```bash
curl https://your-app-name.onrender.com/health
```

## Troubleshooting

### Build Fails
- Check Render build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles locally: `npm run build`

### Database Connection Fails
- Verify MongoDB URI is correct
- Check MongoDB Atlas Network Access settings
- Ensure connection string includes `?authSource=admin` if needed

### Environment Variables Not Loading
- Double-check variable names in Render dashboard
- Restart the service after updating env vars
- Check for typos in variable names

### 502 Bad Gateway
- Check if PORT is set to 5000
- Verify the app is listening on `0.0.0.0`, not `localhost`
- Check Render logs for startup errors

## Cost Optimization

Render Free Tier:
- ✅ 750 hours/month (enough for 1 service running 24/7)
- ✅ Automatic SSL
- ⚠️  Spins down after 15 minutes of inactivity
- ⚠️  Cold starts take ~1 minute

To prevent spin-down:
- Upgrade to paid plan ($7/month)
- Use a cron job to ping your health endpoint every 10 minutes

## Next Steps

1. ✅ Deploy to Render
2. ✅ Test all endpoints
3. ✅ Create first admin user
4. ✅ Secure registration endpoint
5. ✅ Connect frontend application
6. ✅ Set up monitoring/logging
7. ✅ Configure custom domain (optional)
