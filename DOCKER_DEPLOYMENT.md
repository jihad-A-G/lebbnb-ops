# 🚀 Docker Deployment Guide - Lebbnb Application

Complete guide for deploying the Lebbnb application (Frontend + Backend + MongoDB) using Docker on Ubuntu VPS.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Deployment Steps](#deployment-steps)
- [Managing the Application](#managing-the-application)
- [Backup and Restore](#backup-and-restore)
- [Troubleshooting](#troubleshooting)
- [Production Best Practices](#production-best-practices)

---

## 🔧 Prerequisites

### On Your Ubuntu VPS

1. **Update system packages:**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Docker:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

3. **Install Git (if not already installed):**
```bash
sudo apt install git -y
```

4. **Configure Firewall (UFW):**
```bash
# Enable firewall
sudo ufw enable

# Allow SSH (IMPORTANT: Do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application ports (if needed for direct access)
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 5000/tcp  # Backend

# Check status
sudo ufw status
```

---

## ⚡ Quick Start

### 1. Clone Your Repository

```bash
# Navigate to your preferred directory
cd /home/your-username

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/yourusername/lebbnb-ops.git
cd lebbnb-ops
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your production values
nano .env
```

**Important:** Update these critical values:
- `MONGO_ROOT_PASSWORD` - Strong password for MongoDB
- `JWT_ACCESS_SECRET` - Generate using crypto
- `JWT_REFRESH_SECRET` - Generate using crypto
- `GMAIL_USER` and `GMAIL_APP_PASSWORD` - Your email credentials
- `CORS_ORIGIN` - Your frontend URL (e.g., http://your-vps-ip:3000)
- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., http://your-vps-ip:5000/api)

**Generate secure JWT secrets:**
```bash
# Run this command twice to generate two different secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Build and Start the Application

```bash
# Build and start all services
docker compose up -d --build

# Check if all containers are running
docker compose ps
```

### 4. Verify Deployment

```bash
# Check container logs
docker compose logs -f

# Test backend health
curl http://localhost:5000/api/health

# Access the application
# Frontend: http://your-vps-ip:3000
# Backend API: http://your-vps-ip:5000/api
```

---

## 🔐 Environment Configuration

### Root `.env` File (Docker Compose Configuration)

Located at: `/lebbnb-ops/.env`

This file controls the entire Docker Compose setup:

```env
# General
NODE_ENV=production
COMPOSE_PROJECT_NAME=lebbnb

# Ports
FRONTEND_PORT=3000
BACKEND_PORT=5000
MONGO_PORT=27017

# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password_here
MONGO_DATABASE=lebbnb

# Backend
CORS_ORIGIN=http://your-vps-ip:3000
JWT_ACCESS_SECRET=generated_secret_here
JWT_REFRESH_SECRET=generated_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
COMPANY_NAME=Lebbnb

# Frontend
NEXT_PUBLIC_API_URL=http://your-vps-ip:5000/api
```

### Production Configuration (with Domain)

If you have a domain name with SSL:

```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## 📦 Deployment Steps

### Step 1: Prepare Your VPS

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Create application directory
mkdir -p /opt/lebbnb
cd /opt/lebbnb
```

### Step 2: Transfer Your Code

**Option A: Using Git (Recommended)**
```bash
git clone https://github.com/yourusername/lebbnb-ops.git .
```

**Option B: Using SCP from your local machine**
```bash
# Run this from your local machine
scp -r /path/to/lebbnb-ops user@your-vps-ip:/opt/lebbnb/
```

### Step 3: Configure Environment

```bash
cd /opt/lebbnb

# Copy and edit environment file
cp .env.example .env
nano .env

# Update with your production values
```

### Step 4: Build and Deploy

```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Monitor logs
docker compose logs -f
```

### Step 5: Create Default Admin User

```bash
# Access the backend container
docker compose exec backend sh

# Run the admin creation script
node scripts/createAdmin.js

# Exit container
exit
```

---

## 🎮 Managing the Application

### Start/Stop/Restart Services

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
docker compose restart frontend
docker compose restart mongodb
```

### View Logs

```bash
# View all logs
docker compose logs

# Follow logs (real-time)
docker compose logs -f

# View specific service logs
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb

# Last 100 lines
docker compose logs --tail=100 backend
```

### Check Container Status

```bash
# List running containers
docker compose ps

# Check resource usage
docker stats

# Inspect specific container
docker compose inspect backend
```

### Execute Commands in Containers

```bash
# Access backend shell
docker compose exec backend sh

# Access frontend shell
docker compose exec frontend sh

# Access MongoDB shell
docker compose exec mongodb mongosh -u admin -p your_password

# Run npm commands in backend
docker compose exec backend npm run build
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart services
docker compose up -d --build

# Remove old images
docker image prune -f
```

---

## 💾 Backup and Restore

### Backup MongoDB Data

```bash
# Create backup directory
mkdir -p ~/lebbnb-backups

# Backup MongoDB
docker compose exec mongodb mongodump \
  --username=admin \
  --password=your_password \
  --authenticationDatabase=admin \
  --db=lebbnb \
  --out=/tmp/backup

# Copy backup from container to host
docker cp lebbnb-mongodb:/tmp/backup ~/lebbnb-backups/backup-$(date +%Y%m%d)

# Compress backup
cd ~/lebbnb-backups
tar -czf backup-$(date +%Y%m%d).tar.gz backup-$(date +%Y%m%d)
```

### Backup Uploads Volume

```bash
# Create backup of uploads
docker run --rm \
  -v lebbnb_uploads_data:/data \
  -v ~/lebbnb-backups:/backup \
  alpine tar czf /backup/uploads-$(date +%Y%m%d).tar.gz -C /data .
```

### Automated Backup Script

Create a backup script at `/opt/lebbnb/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="$HOME/lebbnb-backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MongoDB
docker compose exec -T mongodb mongodump \
  --username=admin \
  --password=your_password \
  --authenticationDatabase=admin \
  --db=lebbnb \
  --archive > $BACKUP_DIR/mongo-$DATE.archive

# Backup uploads
docker run --rm \
  -v lebbnb_uploads_data:/data \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/uploads-$DATE.tar.gz -C /data .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mongo-*" -mtime +7 -delete
find $BACKUP_DIR -name "uploads-*" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make it executable and add to cron:
```bash
chmod +x /opt/lebbnb/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add this line:
0 2 * * * /opt/lebbnb/backup.sh >> /var/log/lebbnb-backup.log 2>&1
```

### Restore from Backup

```bash
# Restore MongoDB
docker compose exec -T mongodb mongorestore \
  --username=admin \
  --password=your_password \
  --authenticationDatabase=admin \
  --archive < ~/lebbnb-backups/mongo-20241228.archive

# Restore uploads
docker run --rm \
  -v lebbnb_uploads_data:/data \
  -v ~/lebbnb-backups:/backup \
  alpine sh -c "cd /data && tar xzf /backup/uploads-20241228.tar.gz"
```

---

## 🔍 Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker compose logs backend
docker compose logs frontend

# Check container status
docker compose ps

# Rebuild specific service
docker compose up -d --build --force-recreate backend
```

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker compose ps mongodb

# Test MongoDB connection
docker compose exec mongodb mongosh -u admin -p your_password

# Check backend environment variables
docker compose exec backend env | grep MONGO
```

### Frontend Can't Connect to Backend

1. **Check CORS configuration:**
```bash
# Verify CORS_ORIGIN in .env matches your frontend URL
docker compose exec backend env | grep CORS
```

2. **Check API URL in frontend:**
```bash
# Verify NEXT_PUBLIC_API_URL
docker compose exec frontend env | grep API
```

3. **Test backend directly:**
```bash
curl http://your-vps-ip:5000/api/health
```

### Uploads Not Persisting

```bash
# Check volume
docker volume ls | grep uploads

# Inspect volume
docker volume inspect lebbnb_uploads_data

# Check permissions inside container
docker compose exec backend ls -la /app/uploads
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes

# Remove unused images
docker image prune -a

# Remove stopped containers
docker container prune
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Check system resources
htop

# Limit container resources (edit docker-compose.yml):
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          memory: 512M
```

---

## 🛡️ Production Best Practices

### 1. Use Nginx Reverse Proxy

Install and configure Nginx:

```bash
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/lebbnb
```

Add this configuration:

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase body size for file uploads
        client_max_body_size 50M;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/lebbnb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal is setup automatically
# Test renewal
sudo certbot renew --dry-run
```

### 3. Setup Monitoring

Install monitoring tools:

```bash
# Install Docker stats exporter (optional)
docker run -d \
  --name=cadvisor \
  --restart=always \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  google/cadvisor:latest
```

### 4. Setup Log Rotation

Create `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:
```bash
sudo systemctl restart docker
```

### 5. Security Checklist

- [ ] Change default MongoDB password
- [ ] Use strong JWT secrets
- [ ] Configure firewall (UFW)
- [ ] Setup SSL certificates
- [ ] Regular backups
- [ ] Keep Docker updated
- [ ] Use non-root users in containers (already configured)
- [ ] Implement rate limiting (already in backend)
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`

### 6. Environment-Specific Settings

Update your `.env` for production:

```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 7. Restart Policy

Ensure containers restart automatically (already configured in docker-compose.yml):

```yaml
restart: unless-stopped
```

---

## 📊 Monitoring Commands

```bash
# View all container stats
docker stats

# Check disk usage
du -sh /var/lib/docker

# Check volume sizes
docker system df -v

# Monitor logs in real-time
docker compose logs -f --tail=100

# Check application health
curl http://localhost:5000/api/health
curl http://localhost:3000
```

---

## 🔄 Update Workflow

```bash
# 1. Backup current state
./backup.sh

# 2. Pull latest changes
git pull origin main

# 3. Stop services
docker compose down

# 4. Rebuild images
docker compose build --no-cache

# 5. Start services
docker compose up -d

# 6. Verify
docker compose ps
docker compose logs -f

# 7. Clean up old images
docker image prune -f
```

---

## 📞 Support

If you encounter issues:

1. Check logs: `docker compose logs`
2. Verify environment variables
3. Ensure all ports are accessible
4. Check firewall settings
5. Verify DNS settings (if using domain)

---

## 📝 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

## 🎉 Success!

Your Lebbnb application should now be running in production on your Ubuntu VPS!

Access your application:
- Frontend: `http://your-vps-ip:3000` or `https://yourdomain.com`
- Backend API: `http://your-vps-ip:5000/api` or `https://api.yourdomain.com/api`
- Admin Panel: `http://your-vps-ip:3000/admin/login`
