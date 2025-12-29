# 🚀 Quick Docker Deployment Reference

## One-Time Setup

### 1. Install Docker on Ubuntu VPS
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Clone and Configure
```bash
git clone <your-repo-url> lebbnb-ops
cd lebbnb-ops
cp .env.example .env
nano .env  # Edit with your values
```

### 3. Generate Secrets
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Daily Commands

### Start Application
```bash
docker compose up -d
```

### Stop Application
```bash
docker compose down
```

### View Logs
```bash
docker compose logs -f
```

### Restart Service
```bash
docker compose restart backend
docker compose restart frontend
```

### Update Application
```bash
git pull
docker compose up -d --build
```

## Backup Commands

### Backup Everything
```bash
# MongoDB
docker compose exec mongodb mongodump --username=admin --password=YOUR_PASSWORD --authenticationDatabase=admin --db=lebbnb --out=/tmp/backup
docker cp lebbnb-mongodb:/tmp/backup ./backup-$(date +%Y%m%d)

# Uploads
docker run --rm -v lebbnb_uploads_data:/data -v $(pwd):/backup alpine tar czf /backup/uploads-$(date +%Y%m%d).tar.gz -C /data .
```

## Troubleshooting

### Check Status
```bash
docker compose ps
docker stats
```

### Check Logs
```bash
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb
```

### Restart Everything
```bash
docker compose down
docker compose up -d --build
```

### Clean Up
```bash
docker system prune -a
docker volume prune
```

## URLs

- Frontend: `http://your-vps-ip:3000`
- Backend: `http://your-vps-ip:5000/api`
- Admin: `http://your-vps-ip:3000/admin/login`

## Important Files

- `docker-compose.yml` - Main orchestration file
- `.env` - Environment variables
- `Lebbnb-backend/Dockerfile` - Backend container
- `lebbnb-frontend/Dockerfile` - Frontend container

## Environment Variables to Configure

Required in `.env`:
- `MONGO_ROOT_PASSWORD` - MongoDB password
- `JWT_ACCESS_SECRET` - JWT secret (64+ chars)
- `JWT_REFRESH_SECRET` - JWT secret (64+ chars)
- `GMAIL_USER` - Email address
- `GMAIL_APP_PASSWORD` - Gmail app password
- `CORS_ORIGIN` - Frontend URL
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Health Checks

```bash
# Backend
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:3000

# MongoDB
docker compose exec mongodb mongosh -u admin -p YOUR_PASSWORD --eval "db.adminCommand('ping')"
```

---

For detailed documentation, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
