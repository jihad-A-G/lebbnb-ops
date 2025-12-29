# 🏠 Lebbnb - Rental Property Management Platform

Full-stack rental property management application with Next.js frontend and Express backend, fully containerized with Docker.

## 📁 Project Structure

```
lebbnb-ops/
├── Lebbnb-backend/          # Express.js API (TypeScript)
├── lebbnb-frontend/         # Next.js application
├── docker-compose.yml       # Docker orchestration
├── .env.example             # Environment variables template
├── deploy.sh               # Deployment management script
├── DOCKER_DEPLOYMENT.md    # Detailed deployment guide
└── DOCKER_QUICK_REFERENCE.md  # Quick command reference
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Node.js 20+ (for local development)
- Git

### Deploy with Docker (Recommended)

1. **Clone the repository:**
```bash
git clone <your-repo-url> lebbnb-ops
cd lebbnb-ops
```

2. **Configure environment:**
```bash
cp .env.example .env
nano .env  # Edit with your values
```

3. **Generate JWT secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. **Start application using the deployment script:**
```bash
./deploy.sh start
```

Or manually:
```bash
docker compose up -d --build
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Admin Panel: http://localhost:3000/admin/login

## 🛠️ Development

### Backend (Express + TypeScript)

```bash
cd Lebbnb-backend
npm install
cp .env.example .env
npm run dev
```

See [Lebbnb-backend/README.md](Lebbnb-backend/README.md) for details.

### Frontend (Next.js)

```bash
cd lebbnb-frontend
npm install
cp .env.example .env.local
npm run dev
```

See [lebbnb-frontend/README.md](lebbnb-frontend/README.md) for details.

## 🐳 Docker Commands

### Using Deployment Script

The `deploy.sh` script provides an interactive menu:

```bash
./deploy.sh              # Interactive mode
./deploy.sh start        # Start services
./deploy.sh stop         # Stop services
./deploy.sh restart      # Restart services
./deploy.sh logs         # View logs
./deploy.sh status       # Show status
./deploy.sh update       # Update application
./deploy.sh backup       # Backup data
./deploy.sh secrets      # Generate JWT secrets
./deploy.sh cleanup      # Clean Docker resources
```

### Manual Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Restart a service
docker compose restart backend

# Rebuild and restart
docker compose up -d --build
```

## 📦 Services

The application consists of three services:

### 1. MongoDB
- **Port:** 27017
- **Volume:** `mongodb_data`
- Database for storing all application data

### 2. Backend API
- **Port:** 5000
- **Volume:** `uploads_data` (for images/videos)
- RESTful API with authentication

### 3. Frontend
- **Port:** 3000
- Next.js application with server-side rendering

## 🔒 Environment Variables

### Required Variables

Create a `.env` file with these values:

```env
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password

# JWT (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_ACCESS_SECRET=your_64_char_secret
JWT_REFRESH_SECRET=your_64_char_secret

# Email
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# URLs (adjust for production)
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

See [.env.example](.env.example) for all options.

## 💾 Data Persistence

### Volumes

The application uses Docker volumes to persist data:

- `mongodb_data` - Database storage
- `mongodb_config` - Database configuration
- `uploads_data` - User uploaded files (images, videos)

### Backup

```bash
# Using deployment script
./deploy.sh backup

# Manual backup
docker compose exec mongodb mongodump --username=admin --password=YOUR_PASSWORD --authenticationDatabase=admin --db=lebbnb --out=/tmp/backup
```

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for restore instructions.

## 📚 Documentation

- [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) - Complete deployment guide
- [DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md) - Quick command reference
- [Lebbnb-backend/API_DOCUMENTATION.md](Lebbnb-backend/API_DOCUMENTATION.md) - API documentation
- [Lebbnb-backend/AUTH_DOCUMENTATION.md](Lebbnb-backend/AUTH_DOCUMENTATION.md) - Authentication guide

## 🌐 Production Deployment

### Ubuntu VPS Setup

1. **Install Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

2. **Clone and configure:**
```bash
git clone <your-repo> /opt/lebbnb
cd /opt/lebbnb
cp .env.example .env
nano .env  # Configure for production
```

3. **Deploy:**
```bash
./deploy.sh start
```

4. **Setup Nginx (recommended):**
```bash
sudo apt install nginx -y
# Configure reverse proxy (see DOCKER_DEPLOYMENT.md)
```

5. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for detailed production setup.

## 🔍 Monitoring

### Check Service Health

```bash
# All services
docker compose ps

# Logs
docker compose logs -f

# Resource usage
docker stats

# Health endpoints
curl http://localhost:5000/health
curl http://localhost:3000
```

## 🐛 Troubleshooting

### Container won't start

```bash
docker compose logs backend
docker compose logs frontend
docker compose up -d --build --force-recreate
```

### Database connection issues

```bash
docker compose exec mongodb mongosh -u admin -p YOUR_PASSWORD
docker compose restart mongodb
```

### Clear everything and start fresh

```bash
docker compose down -v
docker system prune -a
./deploy.sh start
```

## 🔐 Security Checklist

- [ ] Change default MongoDB password
- [ ] Generate strong JWT secrets (64+ characters)
- [ ] Configure firewall (UFW)
- [ ] Setup SSL certificates
- [ ] Regular backups
- [ ] Update CORS_ORIGIN for production
- [ ] Use environment-specific .env files
- [ ] Keep Docker and system packages updated

## 📊 Technology Stack

### Backend
- Node.js 20
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

### Frontend
- Next.js 16
- React 19
- TypeScript
- TailwindCSS 4
- Axios & React Query

### Infrastructure
- Docker & Docker Compose
- MongoDB 7
- Nginx (for production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📝 License

ISC

## 🆘 Support

For issues and questions:

1. Check [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
2. Review logs: `docker compose logs`
3. Check service status: `docker compose ps`
4. Open an issue on GitHub

## 🎉 Quick Links

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Docs:** http://localhost:5000/api
- **Admin Panel:** http://localhost:3000/admin/login
- **Health Check:** http://localhost:5000/health

---

Made with ❤️ for property management
