# Rental Company API

A comprehensive Express.js + TypeScript + MongoDB backend for a rental company website with admin panel.

## Features

- 🏠 **Property Management** - Full CRUD operations for rental properties
- 📧 **Contact System** - Contact form with admin management
- ℹ️ **Dynamic Content** - Home page and About Us management
- 📸 **Image Upload** - Multer integration for property and content images
- 🔒 **Security** - Helmet, rate limiting, input sanitization, validation
- ✅ **Input Validation** - Express-validator for all endpoints
- 📊 **MongoDB** - Mongoose ODM with proper schemas

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File uploads
- **Express Validator** - Input validation
- **Express Rate Limit** - Rate limiting
- **Helmet** - Security headers
- **Morgan** - Request logging

## Installation

```bash
# Install dependencies
npm install

# Create .env file (see Configuration section)
cp .env.example .env

# Build TypeScript
npm run build

# Development mode
npm run dev

# Production mode
npm start
```

## Configuration

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rental-db
CORS_ORIGIN=*
```

## API Endpoints

### Public Endpoints

#### Properties (Gallery)
- `GET /api/properties` - Get all properties (with filters and pagination)
- `GET /api/properties/:id` - Get single property
- `GET /api/properties/state/:state` - Get properties by state

#### Contact
- `POST /api/contact` - Submit contact form

#### About Us
- `GET /api/about` - Get about us content

#### Home
- `GET /api/home` - Get home page content

### Admin Endpoints

#### Properties Management
- `POST /api/properties/admin` - Create property
- `PUT /api/properties/admin/:id` - Update property
- `DELETE /api/properties/admin/:id` - Delete property
- `POST /api/properties/admin/:id/upload` - Upload property images (max 10)
- `DELETE /api/properties/admin/:id/image/:filename` - Delete property image

#### Contact Management
- `GET /api/contact/admin` - Get all contacts
- `GET /api/contact/admin/stats` - Get contact statistics
- `GET /api/contact/admin/:id` - Get single contact (marks as read)
- `PATCH /api/contact/admin/:id/status` - Update contact status
- `DELETE /api/contact/admin/:id` - Delete contact

#### About Us Management
- `PUT /api/about/admin` - Update about us content
- `POST /api/about/admin/upload` - Upload about images
- `DELETE /api/about/admin/image/:filename` - Delete about image

#### Home Management
- `PUT /api/home/admin` - Update home content
- `POST /api/home/admin/hero-image` - Upload hero image
- `POST /api/home/admin/section/:sectionIndex/image` - Upload section image
- `POST /api/home/admin/testimonial/:testimonialIndex/image` - Upload testimonial image

## Request Examples

### Create Property

```bash
POST /api/properties/admin
Content-Type: application/json

{
  "title": "Beautiful Apartment in Downtown",
  "description": "Spacious 2-bedroom apartment with city views",
  "state": "California",
  "city": "Los Angeles",
  "address": "123 Main St",
  "price": 2500,
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 1200,
  "status": "available",
  "features": ["parking", "gym", "pool"],
  "featured": true
}
```

### Upload Property Images

```bash
POST /api/properties/admin/:propertyId/upload
Content-Type: multipart/form-data

images: [file1.jpg, file2.jpg, ...]
```

### Submit Contact Form

```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "subject": "Property Inquiry",
  "message": "I'm interested in the property..."
}
```

### Get Properties with Filters

```bash
GET /api/properties?state=California&status=available&minPrice=2000&maxPrice=3000&page=1&limit=10
```

## Security Features

- **Helmet** - Sets security HTTP headers
- **Rate Limiting** - Prevents abuse
  - General API: 100 requests/15 min
  - Contact form: 5 submissions/hour
  - Admin operations: 200 requests/15 min
  - File uploads: 20 uploads/15 min
- **Input Validation** - Express-validator on all inputs
- **NoSQL Injection Protection** - Express-mongo-sanitize
- **File Upload Limits** - Max 5MB per file, 10 files max
- **CORS** - Configurable cross-origin requests

## File Upload Configuration

- **Allowed formats**: JPEG, JPG, PNG, GIF, WebP
- **Max file size**: 5MB per file
- **Max files**: 10 files per upload
- **Storage**: `uploads/` directory

## Data Models

### Property
- Title, description, location (state, city, address)
- Price, type, bedrooms, bathrooms, area
- Status (available/rented/sold)
- Features array, images array
- Featured flag

### Contact
- Name, email, phone, subject, message
- Status (new/read/replied)
- IP address tracking
- Timestamps

### About
- Title, subtitle, description
- Mission, vision, values
- Team members with photos
- Company statistics
- Images

### Home
- Hero section (title, subtitle, description, image, CTA)
- Featured properties
- Custom sections
- Testimonials
- Statistics

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [...]
}
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Watch mode for TypeScript
npm run watch
```

## Project Structure

```
src/
├── config/
│   ├── database.ts       # MongoDB connection
│   └── multer.ts         # File upload configuration
├── controllers/
│   ├── property.controller.ts
│   ├── contact.controller.ts
│   ├── about.controller.ts
│   └── home.controller.ts
├── middleware/
│   ├── validation.ts     # Input validation rules
│   ├── rateLimiter.ts    # Rate limiting configs
│   └── errorHandler.ts   # Error handling utilities
├── models/
│   ├── Property.model.ts
│   ├── Contact.model.ts
│   ├── About.model.ts
│   └── Home.model.ts
├── routes/
│   ├── property.routes.ts
│   ├── contact.routes.ts
│   ├── about.routes.ts
│   └── home.routes.ts
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## License

ISC
