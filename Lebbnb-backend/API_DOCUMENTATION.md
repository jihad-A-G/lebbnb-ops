# API Endpoints Summary

## 🌐 Public Website Endpoints

### Home Page
- **GET** `/api/home`
  - Returns home page content including hero section, featured properties, sections, testimonials, and stats
  - No authentication required

### Gallery/Properties
- **GET** `/api/properties`
  - Get all properties with filters and pagination
  - Query params: `state`, `status`, `propertyType`, `minPrice`, `maxPrice`, `featured`, `page`, `limit`
  
- **GET** `/api/properties/:id`
  - Get single property details
  
- **GET** `/api/properties/state/:state`
  - Get all available properties in a specific state

### About Us
- **GET** `/api/about`
  - Get about us page content including mission, vision, team, stats

### Contact Us
- **POST** `/api/contact`
  - Submit contact form
  - Rate limited: 5 submissions per hour per IP
  - Required fields: `name`, `email`, `subject`, `message`
  - Optional: `phone`

---

## 🔐 Admin Panel Endpoints

### Property Management

#### CRUD Operations
- **POST** `/api/properties/admin`
  - Create new property
  - Required: `title`, `description`, `state`, `city`, `address`, `price`, `propertyType`, `area`
  - Optional: `bedrooms`, `bathrooms`, `yearBuilt`, `status`, `features`, `featured`

- **PUT** `/api/properties/admin/:id`
  - Update existing property
  - All fields optional

- **DELETE** `/api/properties/admin/:id`
  - Delete property and all associated images

#### Image Management
- **POST** `/api/properties/admin/:id/upload`
  - Upload up to 10 images per request
  - Form-data field: `images`
  - Max 5MB per image
  - Formats: JPEG, JPG, PNG, GIF, WebP

- **DELETE** `/api/properties/admin/:id/image/:filename`
  - Delete specific property image

### Contact Management

- **GET** `/api/contact/admin`
  - Get all contact submissions
  - Query params: `status`, `page`, `limit`

- **GET** `/api/contact/admin/stats`
  - Get contact statistics (total, by status)

- **GET** `/api/contact/admin/:id`
  - Get single contact (automatically marks as read)

- **PATCH** `/api/contact/admin/:id/status`
  - Update contact status
  - Body: `{ "status": "new" | "read" | "replied" }`

- **DELETE** `/api/contact/admin/:id`
  - Delete contact submission

### About Us Management

- **PUT** `/api/about/admin`
  - Update about us content
  - Fields: `title`, `subtitle`, `description`, `mission`, `vision`, `values`, `teamMembers`, `companyStats`

- **POST** `/api/about/admin/upload`
  - Upload about us images
  - Form-data field: `images`
  - Max 10 images

- **DELETE** `/api/about/admin/image/:filename`
  - Delete specific about image

### Home Page Management

- **PUT** `/api/home/admin`
  - Update home page content
  - Fields: `heroTitle`, `heroSubtitle`, `heroDescription`, `heroCtaText`, `heroCtaLink`, `featuredProperties`, `sections`, `testimonials`, `stats`

- **POST** `/api/home/admin/hero-image`
  - Upload hero image
  - Form-data field: `image`

- **POST** `/api/home/admin/section/:sectionIndex/image`
  - Upload image for specific section
  - Form-data field: `image`

- **POST** `/api/home/admin/testimonial/:testimonialIndex/image`
  - Upload image for specific testimonial
  - Form-data field: `image`

---

## 🔒 Security Features

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Contact Form**: 5 submissions per hour
- **Admin Operations**: 200 requests per 15 minutes
- **File Uploads**: 20 uploads per 15 minutes

### Input Validation
- All endpoints have express-validator validation
- NoSQL injection protection via express-mongo-sanitize
- XSS protection
- File type and size validation

### Error Responses
All errors return consistent format:
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [...]
}
```

---

## 📁 File Upload Details

### Configuration
- **Location**: `uploads/` directory
- **Access**: Available at `/uploads/:filename`
- **Max Size**: 5MB per file
- **Max Files**: 10 per upload
- **Formats**: JPEG, JPG, PNG, GIF, WebP

### File Naming
- Format: `originalname-timestamp-random.ext`
- Sanitized to prevent path traversal

---

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/rental-db
   CORS_ORIGIN=*
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## 📊 Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [...]
}
```

### Pagination Response
```json
{
  "status": "success",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```
