# Example API Requests

## Setup
Base URL: `http://localhost:3000`

---

## Public Endpoints

### 1. Get Home Page Content
```http
GET /api/home
```

### 2. Get All Properties
```http
GET /api/properties?page=1&limit=10&status=available
```

### 3. Get Properties by State
```http
GET /api/properties/state/California
```

### 4. Get Single Property
```http
GET /api/properties/507f1f77bcf86cd799439011
```

### 5. Get About Us
```http
GET /api/about
```

### 6. Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-0123",
  "subject": "Property Inquiry",
  "message": "I'm interested in learning more about your rental properties in California."
}
```

---

## Admin Endpoints - Properties

### 7. Create Property
```http
POST /api/properties/admin
Content-Type: application/json

{
  "title": "Luxury Downtown Apartment",
  "description": "Beautiful 2-bedroom apartment in the heart of downtown with stunning city views",
  "state": "California",
  "city": "Los Angeles",
  "address": "123 Main Street",
  "price": 2500,
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 1200,
  "yearBuilt": 2020,
  "status": "available",
  "features": ["parking", "gym", "pool", "balcony"],
  "featured": true
}
```

### 8. Update Property
```http
PUT /api/properties/admin/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "price": 2600,
  "status": "rented",
  "featured": false
}
```

### 9. Upload Property Images
```http
POST /api/properties/admin/507f1f77bcf86cd799439011/upload
Content-Type: multipart/form-data

images: [file1.jpg, file2.jpg, file3.jpg]
```

### 10. Delete Property Image
```http
DELETE /api/properties/admin/507f1f77bcf86cd799439011/image/apartment-1234567890-123.jpg
```

### 11. Delete Property
```http
DELETE /api/properties/admin/507f1f77bcf86cd799439011
```

---

## Admin Endpoints - Contacts

### 12. Get All Contacts
```http
GET /api/contact/admin?status=new&page=1&limit=20
```

### 13. Get Contact Stats
```http
GET /api/contact/admin/stats
```

### 14. Get Single Contact
```http
GET /api/contact/admin/507f1f77bcf86cd799439011
```

### 15. Update Contact Status
```http
PATCH /api/contact/admin/507f1f77bcf86cd799439011/status
Content-Type: application/json

{
  "status": "replied"
}
```

### 16. Delete Contact
```http
DELETE /api/contact/admin/507f1f77bcf86cd799439011
```

---

## Admin Endpoints - About Us

### 17. Update About Us
```http
PUT /api/about/admin
Content-Type: application/json

{
  "title": "About Our Rental Company",
  "subtitle": "Your trusted partner in finding the perfect home",
  "description": "We are a leading rental company with over 20 years of experience...",
  "mission": "To provide quality housing solutions for everyone",
  "vision": "To be the most trusted rental company in the region",
  "values": [
    "Integrity",
    "Customer Service",
    "Quality",
    "Innovation"
  ],
  "teamMembers": [
    {
      "name": "Jane Smith",
      "position": "CEO",
      "bio": "Jane has 15 years of experience in real estate..."
    },
    {
      "name": "John Johnson",
      "position": "Property Manager",
      "bio": "John oversees our property portfolio..."
    }
  ],
  "companyStats": [
    {
      "label": "Properties",
      "value": "500+"
    },
    {
      "label": "Happy Clients",
      "value": "2000+"
    },
    {
      "label": "Years Experience",
      "value": "20+"
    }
  ]
}
```

### 18. Upload About Images
```http
POST /api/about/admin/upload
Content-Type: multipart/form-data

images: [office1.jpg, office2.jpg, team.jpg]
```

### 19. Delete About Image
```http
DELETE /api/about/admin/image/office-1234567890-123.jpg
```

---

## Admin Endpoints - Home Page

### 20. Update Home Content
```http
PUT /api/home/admin
Content-Type: application/json

{
  "heroTitle": "Find Your Dream Home Today",
  "heroSubtitle": "Premium Rental Properties in Prime Locations",
  "heroDescription": "Browse our exclusive collection of rental properties",
  "heroCtaText": "View Properties",
  "heroCtaLink": "/properties",
  "sections": [
    {
      "title": "Why Choose Us",
      "content": "We offer the best rental properties with exceptional service",
      "order": 1
    },
    {
      "title": "Our Services",
      "content": "Full-service property management and tenant support",
      "order": 2
    }
  ],
  "testimonials": [
    {
      "name": "Sarah Williams",
      "text": "Found the perfect apartment through this company. Highly recommended!",
      "rating": 5
    },
    {
      "name": "Mike Brown",
      "text": "Professional service and great properties. Very satisfied!",
      "rating": 5
    }
  ],
  "stats": [
    {
      "label": "Active Listings",
      "value": "500+",
      "icon": "home"
    },
    {
      "label": "Satisfied Clients",
      "value": "2000+",
      "icon": "users"
    },
    {
      "label": "Cities Covered",
      "value": "50+",
      "icon": "map"
    }
  ]
}
```

### 21. Upload Hero Image
```http
POST /api/home/admin/hero-image
Content-Type: multipart/form-data

image: hero-banner.jpg
```

### 22. Upload Section Image
```http
POST /api/home/admin/section/0/image
Content-Type: multipart/form-data

image: section-image.jpg
```

### 23. Upload Testimonial Image
```http
POST /api/home/admin/testimonial/0/image
Content-Type: multipart/form-data

image: customer-photo.jpg
```

---

## Query Parameters Examples

### Filter Properties
```http
# Available apartments in California under $3000
GET /api/properties?state=California&propertyType=apartment&maxPrice=3000&status=available

# Featured properties only
GET /api/properties?featured=true&limit=6

# Price range with pagination
GET /api/properties?minPrice=2000&maxPrice=5000&page=1&limit=10
```

### Filter Contacts
```http
# New unread contacts
GET /api/contact/admin?status=new

# Replied contacts with pagination
GET /api/contact/admin?status=replied&page=1&limit=20
```

---

## Response Examples

### Success Response
```json
{
  "status": "success",
  "message": "Property created successfully",
  "data": {
    "property": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxury Downtown Apartment",
      "price": 2500,
      ...
    }
  }
}
```

### Error Response (Validation)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

### Error Response (Not Found)
```json
{
  "status": "error",
  "message": "Property not found"
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": {
    "properties": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

---

## Testing with cURL

### Create Property
```bash
curl -X POST http://localhost:3000/api/properties/admin \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Modern Condo",
    "description": "Beautiful condo in downtown",
    "state": "California",
    "city": "San Francisco",
    "address": "456 Market St",
    "price": 3500,
    "propertyType": "condo",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1000,
    "status": "available"
  }'
```

### Submit Contact Form
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question",
    "message": "I have a question about your properties"
  }'
```

### Upload Images
```bash
curl -X POST http://localhost:3000/api/properties/admin/PROPERTY_ID/upload \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "images=@image3.jpg"
```
