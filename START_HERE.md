# 🎉 Getting Started with Docker Deployment

## ✨ What's Been Created

Your Lebbnb application is now fully Dockerized! Here's what's ready:

### 📦 Docker Files
- ✅ **Backend Dockerfile** - Production-ready multi-stage build
- ✅ **Frontend Dockerfile** - Optimized Next.js container
- ✅ **docker-compose.yml** - Orchestrates all services
- ✅ **docker-compose.prod.yml** - Production overrides

### 🛠️ Tools & Scripts
- ✅ **deploy.sh** - Interactive deployment manager
- ✅ **verify-setup.sh** - Setup verification tool

### 📚 Documentation
- ✅ **README.md** - Project overview
- ✅ **DOCKER_DEPLOYMENT.md** - Complete deployment guide (3000+ lines)
- ✅ **DOCKER_QUICK_REFERENCE.md** - Quick commands
- ✅ **DEPLOYMENT_CHECKLIST.md** - Step-by-step checklist
- ✅ **IMPLEMENTATION_SUMMARY.md** - What was implemented

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit with your values
nano .env
```

**Required values:**
- `MONGO_ROOT_PASSWORD` - Create a strong password
- `JWT_ACCESS_SECRET` - Generate with: `./deploy.sh secrets`
- `JWT_REFRESH_SECRET` - Generate with: `./deploy.sh secrets`
- `GMAIL_USER` - Your Gmail address
- `GMAIL_APP_PASSWORD` - Gmail app password
- `CORS_ORIGIN` - Your frontend URL
- `NEXT_PUBLIC_API_URL` - Your backend API URL

### Step 2: Verify Setup
```bash
# Run verification script
./verify-setup.sh
```

This checks:
- Docker installation
- All required files
- Port availability
- Configuration validity

### Step 3: Deploy!
```bash
# Start all services
./deploy.sh start

# Or use Docker Compose directly
docker compose up -d --build
```

## 🌐 Access Your Application

Once deployed, access:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Admin Panel:** http://localhost:3000/admin/login
- **Health Check:** http://localhost:5000/health

## 📖 What to Read Next

### For Quick Deployment:
1. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) ⭐ Start here!
2. [DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md) - Common commands

### For Production:
1. [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) - Complete guide
2. Sections to focus on:
   - Ubuntu VPS Setup
   - Nginx Configuration
   - SSL with Let's Encrypt
   - Backup Procedures

## 🎮 Using the Deployment Script

The `deploy.sh` script makes everything easy:

```bash
# Interactive menu (recommended for beginners)
./deploy.sh

# Or use commands directly
./deploy.sh start      # Start services
./deploy.sh stop       # Stop services
./deploy.sh restart    # Restart services
./deploy.sh logs       # View logs
./deploy.sh status     # Show status
./deploy.sh backup     # Backup data
./deploy.sh secrets    # Generate JWT secrets
./deploy.sh update     # Update application
```

## 🐳 Manual Docker Commands

If you prefer manual control:

```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Check status
docker compose ps

# Restart a service
docker compose restart backend
```

## 📋 Deployment Workflows

### Local Development
```bash
1. Edit .env with local settings
2. ./deploy.sh start
3. Access http://localhost:3000
4. Make changes to code
5. ./deploy.sh restart
```

### Production VPS
```bash
1. SSH into your VPS
2. Clone repository
3. Copy .env.example to .env
4. Edit .env with production values
5. ./deploy.sh start
6. Setup Nginx (see DOCKER_DEPLOYMENT.md)
7. Setup SSL certificates
8. Configure automated backups
```

## 🔐 Important Security Steps

Before production:

1. **Change Passwords:**
   - MongoDB root password
   - Generate new JWT secrets

2. **Update URLs:**
   - `CORS_ORIGIN` → Your domain
   - `NEXT_PUBLIC_API_URL` → Your API URL

3. **Setup Firewall:**
   ```bash
   sudo ufw enable
   sudo ufw allow 22,80,443/tcp
   ```

4. **Get SSL Certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## 📊 Monitoring Your Application

```bash
# Check if services are running
docker compose ps

# View real-time logs
docker compose logs -f

# Check resource usage
docker stats

# Test health endpoints
curl http://localhost:5000/health
curl http://localhost:3000
```

## 💾 Backup Your Data

### Manual Backup
```bash
./deploy.sh backup
```

### Automated Backups
See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) section "Backup and Restore"

## 🆘 Troubleshooting

### Services won't start?
```bash
# Check logs
docker compose logs

# Verify configuration
docker compose config

# Check port conflicts
sudo lsof -i :3000
sudo lsof -i :5000
```

### Can't connect to database?
```bash
# Check MongoDB is running
docker compose ps mongodb

# View MongoDB logs
docker compose logs mongodb

# Restart MongoDB
docker compose restart mongodb
```

### Frontend can't reach backend?
1. Check `CORS_ORIGIN` in `.env`
2. Check `NEXT_PUBLIC_API_URL` in `.env`
3. Verify backend is running: `curl http://localhost:5000/health`

## 📁 Project Structure

```
lebbnb-ops/
├── 📁 Lebbnb-backend/       # Backend application
│   ├── Dockerfile           # Backend container
│   └── .env.example         # Backend env template
│
├── 📁 lebbnb-frontend/      # Frontend application
│   ├── Dockerfile           # Frontend container
│   └── .env.example         # Frontend env template
│
├── 🐳 docker-compose.yml    # Main orchestration
├── 🐳 docker-compose.prod.yml  # Production config
├── 📝 .env.example          # Environment template
├── 🚀 deploy.sh             # Deployment script
├── ✅ verify-setup.sh       # Verification script
│
└── 📚 Documentation
    ├── README.md
    ├── DOCKER_DEPLOYMENT.md
    ├── DOCKER_QUICK_REFERENCE.md
    ├── DEPLOYMENT_CHECKLIST.md
    └── IMPLEMENTATION_SUMMARY.md
```

## ✅ Success Checklist

- [ ] Read this file
- [ ] Created `.env` from template
- [ ] Generated JWT secrets
- [ ] Configured email settings
- [ ] Ran `./verify-setup.sh`
- [ ] Started services with `./deploy.sh start`
- [ ] Accessed frontend at http://localhost:3000
- [ ] Tested backend at http://localhost:5000/api
- [ ] Created admin user
- [ ] Tested file upload
- [ ] Setup backups

## 🎯 Next Steps

### For Development:
1. ✅ Start services: `./deploy.sh start`
2. ✅ Make changes to code
3. ✅ Restart to apply: `./deploy.sh restart`
4. ✅ View logs: `./deploy.sh logs`

### For Production:
1. ✅ Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. ✅ Read [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
3. ✅ Setup VPS with Ubuntu
4. ✅ Configure domain and SSL
5. ✅ Deploy with production settings
6. ✅ Setup monitoring and backups

## 💡 Tips

- **Use the interactive script:** `./deploy.sh` - easier for beginners
- **Check logs often:** `docker compose logs -f`
- **Backup before updates:** `./deploy.sh backup`
- **Test locally first:** Before deploying to production
- **Read the docs:** Everything is documented!

## 📞 Need Help?

1. **Check logs:** `docker compose logs`
2. **Verify setup:** `./verify-setup.sh`
3. **Read documentation:** Start with DEPLOYMENT_CHECKLIST.md
4. **Check status:** `docker compose ps`
5. **Review errors:** Most issues are in logs

## 🎉 You're All Set!

Your application is ready to deploy. Choose your path:

**Quick Test (Local):**
```bash
cp .env.example .env
./deploy.sh secrets  # Copy the secrets to .env
nano .env            # Add email settings
./deploy.sh start
```

**Production (VPS):**
```bash
# Follow DEPLOYMENT_CHECKLIST.md step by step
```

---

**Happy Deploying! 🚀**

For detailed information, see:
- 📋 [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step
- 📖 [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) - Complete guide
- ⚡ [DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md) - Quick commands
