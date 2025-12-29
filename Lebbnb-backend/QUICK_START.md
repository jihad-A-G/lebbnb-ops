# Quick Start Guide

## ✅ Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env` file is already created. Update if needed:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rental-db
CORS_ORIGIN=*
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For Ubuntu/Linux
sudo systemctl start mongod

# For MacOS (if installed via Homebrew)
brew services start mongodb-community

# Or run manually
mongod --dbpath /path/to/data/directory
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Create Your First Property
```bash
curl -X POST http://localhost:3000/api/properties/admin \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Modern Apartment",
    "description": "Beautiful 2-bedroom apartment",
    "state": "California",
    "city": "Los Angeles",
    "address": "123 Main St",
    "price": 2500,
    "propertyType": "apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1200,
    "status": "available",
    "featured": true
  }'
```

### Get All Properties
```bash
curl http://localhost:3000/api/properties
```

## 📁 Project Structure

```
rentalProject/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # MongoDB connection
│   │   └── multer.ts     # File upload config
│   ├── controllers/      # Request handlers
│   │   ├── property.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── about.controller.ts
│   │   └── home.controller.ts
│   ├── middleware/       # Express middleware
│   │   ├── validation.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── models/          # Mongoose schemas
│   │   ├── Property.model.ts
│   │   ├── Contact.model.ts
│   │   ├── About.model.ts
│   │   └── Home.model.ts
│   ├── routes/          # API routes
│   │   ├── property.routes.ts
│   │   ├── contact.routes.ts
│   │   ├── about.routes.ts
│   │   └── home.routes.ts
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── uploads/             # Uploaded images (created automatically)
├── dist/                # Compiled JavaScript (after build)
├── .env                 # Environment variables
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
└── README.md            # Documentation
```

## 🔑 Key Features Implemented

### ✅ Public Website Endpoints
- [x] Home page content management
- [x] Property gallery with filters
- [x] About us page
- [x] Contact form submission

### ✅ Admin Panel Endpoints
- [x] Property CRUD operations
- [x] Image upload management
- [x] Contact form management
- [x] Content management (Home, About)

### ✅ Security Features
- [x] Helmet for security headers
- [x] Rate limiting (different limits for different endpoints)
- [x] Input validation with express-validator
- [x] NoSQL injection protection
- [x] File upload validation (type, size)
- [x] CORS configuration

### ✅ File Upload System
- [x] Multer configuration
- [x] Image validation (JPEG, PNG, GIF, WebP)
- [x] Size limits (5MB per file)
- [x] Multiple file uploads (max 10)
- [x] Automatic file cleanup on delete

## 📝 Next Steps

### 1. Add Authentication
For production use, add authentication for admin endpoints:
- JWT authentication
- API keys
- Role-based access control

### 2. Frontend Integration
The API is ready to be consumed by any frontend:
- React
- Vue
- Angular
- Next.js

### 3. Testing
Add tests for all endpoints:
```bash
npm install --save-dev jest supertest @types/jest @types/supertest
```

### 4. Deploy
Deploy to:
- Heroku
- DigitalOcean
- AWS
- Vercel (with serverless)

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change PORT in `.env` or kill the process using port 3000
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Upload Directory Permission Error
**Solution**: Ensure the app has write permissions
```bash
chmod 755 uploads
```

## 📚 Documentation

- [README.md](README.md) - Project overview
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Complete API reference
- [EXAMPLE_REQUESTS.md](EXAMPLE_REQUESTS.md) - Example API calls

## 💡 Tips

1. **Use a REST Client**: Install Thunder Client or Postman for testing
2. **Check Logs**: Development mode shows detailed logs
3. **Database GUI**: Use MongoDB Compass to view data
4. **Static Files**: Uploaded images are accessible at `/uploads/:filename`

## 🎯 Common Tasks

### View All Collections in MongoDB
```bash
mongosh
use rental-db
show collections
db.properties.find().pretty()
```

### Clear All Data
```bash
mongosh
use rental-db
db.dropDatabase()
```

### Build for Production
```bash
npm run build
NODE_ENV=production npm start
```

## 📞 API Testing Tools

### Browser
- [http://localhost:3000](http://localhost:3000) - API info
- [http://localhost:3000/health](http://localhost:3000/health) - Health check
- [http://localhost:3000/api/properties](http://localhost:3000/api/properties) - Get properties

### VS Code Extensions
- Thunder Client - REST API testing
- MongoDB for VS Code - Database viewer

### Desktop Apps
- Postman - API testing
- Insomnia - API testing
- MongoDB Compass - Database GUI

---

**You're all set!** 🎉

Start building amazing features on top of this solid foundation!
