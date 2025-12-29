# 🚀 Deployment Checklist

Use this checklist before deploying to production.

## ☑️ Pre-Deployment

### 1. Environment Setup
- [ ] Created `.env` file from `.env.example`
- [ ] Changed `MONGO_ROOT_PASSWORD` to a strong password
- [ ] Generated and set `JWT_ACCESS_SECRET` (64+ chars)
- [ ] Generated and set `JWT_REFRESH_SECRET` (64+ chars)
- [ ] Configured `GMAIL_USER` and `GMAIL_APP_PASSWORD`
- [ ] Updated `CORS_ORIGIN` to match frontend URL
- [ ] Updated `NEXT_PUBLIC_API_URL` to match backend URL
- [ ] Reviewed all environment variables

**Generate JWT Secrets:**
```bash
./deploy.sh secrets
# Or manually:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Code Verification
- [ ] Latest code is pulled from Git
- [ ] All tests pass (if applicable)
- [ ] No console.log or debug code in production
- [ ] Error handling is implemented
- [ ] Rate limiting is configured

### 3. Docker Files
- [ ] `Lebbnb-backend/Dockerfile` exists
- [ ] `lebbnb-frontend/Dockerfile` exists
- [ ] `docker-compose.yml` is configured
- [ ] `.dockerignore` files are present

### 4. System Requirements
- [ ] Docker is installed and running
- [ ] Docker Compose is installed
- [ ] Sufficient disk space (10GB+ recommended)
- [ ] Ports 3000, 5000, 27017 are available

**Verify Setup:**
```bash
./verify-setup.sh
```

## ☑️ Initial Deployment

### 5. Build and Start
- [ ] Run: `./deploy.sh start` or `docker compose up -d --build`
- [ ] Check container status: `docker compose ps`
- [ ] All containers show "Up" status
- [ ] All health checks passing

### 6. Create Admin User
- [ ] Access backend container: `docker compose exec backend sh`
- [ ] Run: `node scripts/createAdmin.js`
- [ ] Note down admin credentials
- [ ] Exit container: `exit`

### 7. Verify Services
- [ ] Frontend loads: http://localhost:3000 (or your domain)
- [ ] Backend API responds: http://localhost:5000/api
- [ ] Health check passes: http://localhost:5000/health
- [ ] Admin panel accessible: http://localhost:3000/admin/login
- [ ] Can login with admin credentials
- [ ] File upload works

**Test Commands:**
```bash
# Health checks
curl http://localhost:5000/health
curl http://localhost:3000

# Check logs
docker compose logs -f
```

## ☑️ Production Configuration (VPS)

### 8. Server Setup
- [ ] Ubuntu VPS is up and running
- [ ] SSH access configured
- [ ] Firewall (UFW) is configured
- [ ] Allowed ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)
- [ ] Docker installed on VPS
- [ ] Git installed on VPS

**Firewall Setup:**
```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

### 9. Domain and SSL (if using domain)
- [ ] Domain DNS configured to point to VPS IP
- [ ] Nginx installed and configured
- [ ] SSL certificates obtained (Let's Encrypt)
- [ ] Auto-renewal configured
- [ ] HTTPS redirects working

**SSL Setup:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 10. Production Environment
- [ ] `.env` uses production values
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGIN` set to production URL
- [ ] `NEXT_PUBLIC_API_URL` set to production API URL
- [ ] MongoDB not exposed to public (ports: [])
- [ ] Resource limits configured (docker-compose.prod.yml)

**Production Deployment:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## ☑️ Post-Deployment

### 11. Security
- [ ] Changed all default passwords
- [ ] JWT secrets are unique and secure
- [ ] MongoDB not accessible from outside
- [ ] Containers running as non-root users
- [ ] Firewall configured correctly
- [ ] SSL/TLS enabled
- [ ] Rate limiting tested

### 12. Monitoring
- [ ] Container health checks working
- [ ] Logs are accessible: `docker compose logs`
- [ ] Resource usage is normal: `docker stats`
- [ ] Disk space monitored: `df -h`
- [ ] Set up monitoring alerts (optional)

### 13. Backup System
- [ ] Backup script tested: `./deploy.sh backup`
- [ ] Backup directory created
- [ ] Automated backups scheduled (cron)
- [ ] Backup retention policy set
- [ ] Restore procedure tested

**Setup Automated Backups:**
```bash
chmod +x /opt/lebbnb/backup.sh
crontab -e
# Add: 0 2 * * * /opt/lebbnb/backup.sh >> /var/log/lebbnb-backup.log 2>&1
```

### 14. Performance
- [ ] Frontend loads quickly
- [ ] API responses are fast
- [ ] Images load properly
- [ ] No memory leaks: `docker stats`
- [ ] Database queries optimized

### 15. Documentation
- [ ] `.env.example` updated with all variables
- [ ] Deployment process documented
- [ ] Admin credentials stored securely
- [ ] Backup locations documented
- [ ] Team members have access to docs

## ☑️ Ongoing Maintenance

### 16. Regular Tasks
- [ ] Weekly backup verification
- [ ] Monthly security updates: `sudo apt update && sudo apt upgrade`
- [ ] Monitor disk space usage
- [ ] Review application logs
- [ ] Check for Docker updates
- [ ] Review and rotate logs

### 17. Update Procedure
- [ ] Backup before updates
- [ ] Pull latest code: `git pull`
- [ ] Rebuild images: `./deploy.sh update`
- [ ] Test after updates
- [ ] Monitor for issues

## ☑️ Emergency Procedures

### 18. Rollback Plan
- [ ] Know how to restore from backup
- [ ] Keep previous Docker images
- [ ] Document rollback steps
- [ ] Test rollback procedure

**Quick Rollback:**
```bash
# Stop services
docker compose down

# Restore backup
docker compose exec -T mongodb mongorestore --archive < backups/mongo-YYYYMMDD.archive

# Start services
docker compose up -d
```

### 19. Troubleshooting
- [ ] Know how to view logs: `docker compose logs`
- [ ] Know how to restart services: `docker compose restart`
- [ ] Know how to access containers: `docker compose exec`
- [ ] Have backup contact (DevOps/Support)

## 📋 Quick Reference

### Essential Commands
```bash
# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# View logs
./deploy.sh logs

# Check status
./deploy.sh status

# Backup data
./deploy.sh backup

# Update application
./deploy.sh update
```

### Service URLs
- Frontend: http://your-domain:3000
- Backend: http://your-domain:5000/api
- Admin: http://your-domain:3000/admin/login
- Health: http://your-domain:5000/health

### Important Files
- `.env` - Environment configuration
- `docker-compose.yml` - Service orchestration
- `deploy.sh` - Management script
- `DOCKER_DEPLOYMENT.md` - Full documentation

## ✅ Sign-Off

**Deployed by:** _________________

**Date:** _________________

**Environment:** [ ] Development  [ ] Staging  [ ] Production

**Version/Commit:** _________________

**Notes:**
_______________________________________________________
_______________________________________________________
_______________________________________________________

---

**Status:** [ ] All checks passed - Ready for production

For detailed help, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
