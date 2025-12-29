# Lebbnb Quick Start Guide

## 🎉 Your Application is Ready!

The Lebbnb Real Estate Portfolio website has been successfully set up with all features implemented.

## ✅ What's Been Created

### Public Website Features:
1. **Landing Page** (`/`)
   - Animated hero section with search functionality
   - Featured properties showcase
   - Company statistics with count-up animations
   - Customer testimonials
   - Call-to-action sections

2. **Properties Gallery** (`/properties`)
   - Advanced filtering (location, price, type, status)
   - Responsive grid layout
   - Pagination support
   - Property cards with images and details

3. **Property Details** (`/properties/[id]`)
   - Image gallery with thumbnails
   - Full property information
   - Features and amenities list
   - Contact integration

4. **About Us Page** (`/about`)
   - Company mission and vision
   - Core values display
   - Team members section
   - Company statistics

5. **Contact Page** (`/contact`)
   - Contact form with validation
   - Office information
   - Map placeholder
   - Real-time toast notifications

### Admin Panel Features:
1. **Dashboard** (`/admin`)
   - Overview statistics
   - Recent properties
   - Recent messages
   - Quick actions

2. **Properties Management** (`/admin/properties`)
   - List all properties
   - Create new properties
   - Edit existing properties
   - Delete properties
   - Upload multiple images
   - Manage property status

3. **Contact Messages** (`/admin/contacts`)
   - View all messages
   - Filter by status (new, read, replied)
   - Mark as replied
   - Delete messages
   - Statistics dashboard

## 🚀 How to Run

### 1. Start the Backend (Required)
```bash
cd Lebbnb-backend
npm install  # First time only
npm run dev
```
The backend should run on http://localhost:5000

### 2. Start the Frontend
```bash
cd lebbnb-frontend  # (current directory)
npm run dev
```
The frontend runs on http://localhost:3000

### 3. Access the Application
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

## 📋 Default Test Data

The backend may need initial data. You can:
1. Use the admin panel to add properties
2. Submit test contact forms
3. Or seed data directly in MongoDB

## 🎨 Design Features

### Colors (Green Theme):
- Primary: `#2d6a4f` (Dark Green)
- Accent: `#52b788` (Light Green)
- Background: White with soft gray gradients

### Animations:
- Smooth page transitions
- Hover effects on all interactive elements
- Count-up animations for statistics
- Parallax scrolling effects
- Loading states

### Typography:
- Headings: Playfair Display (Elegant serif)
- Body: Inter (Clean sans-serif)

## 📱 Responsive Design

Fully responsive across all devices:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Configuration

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend Configuration
Ensure Lebbnb-backend/.env has:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## 📂 Key Files

### Frontend:
- `src/app/page.tsx` - Home page
- `src/app/admin/page.tsx` - Admin dashboard
- `src/lib/api.ts` - API integration
- `src/types/index.ts` - TypeScript types

### Backend:
- `Lebbnb-backend/src/app.ts` - Express server
- `Lebbnb-backend/src/routes/` - API routes
- `Lebbnb-backend/src/models/` - MongoDB models

## 🎯 Testing the Application

1. **Home Page:**
   - Visit http://localhost:3000
   - Try the search functionality
   - Check animations and hover effects

2. **Properties:**
   - Browse properties at `/properties`
   - Test filters (location, price, type)
   - Click on a property for details

3. **Contact Form:**
   - Go to `/contact`
   - Fill and submit the form
   - Check for success toast

4. **Admin Panel:**
   - Access `/admin`
   - View dashboard statistics
   - Try adding a new property
   - Upload images
   - Check contact messages

## 🐛 Troubleshooting

### Issue: Can't connect to backend
**Solution:** Ensure backend is running on port 5000

### Issue: Images not loading
**Solution:** Check the API URL in .env.local matches your backend

### Issue: MongoDB connection error
**Solution:** Verify MongoDB connection string in backend .env

### Issue: Build errors
**Solution:** 
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📝 Next Steps

1. **Add Content:**
   - Use admin panel to add properties
   - Update About Us page content
   - Add home page content

2. **Customize:**
   - Modify colors in `globals.css`
   - Update company information in footer
   - Add your logo

3. **Deploy:**
   - Deploy frontend to Vercel
   - Deploy backend to Railway/Render
   - Update API URL in production .env

## 🎓 Code Structure

### Component Patterns:
```typescript
// All components are client-side for interactivity
'use client';

// Uses React Query for data fetching
const { data, isLoading } = useQuery({...});

// Framer Motion for animations
<motion.div initial={{...}} animate={{...}}>
```

### API Calls:
```typescript
// Public API
import { publicApi } from '@/lib/api';
const properties = await publicApi.getProperties();

// Admin API
import { adminApi } from '@/lib/api';
await adminApi.createProperty(data);
```

## 📊 Features Breakdown

### Implemented:
✅ Landing page with hero section
✅ Properties gallery with filtering
✅ Property detail pages
✅ About us page
✅ Contact form
✅ Admin dashboard
✅ Property CRUD operations
✅ Contact management
✅ Image uploads
✅ Responsive design
✅ Animations throughout
✅ Toast notifications
✅ Loading states
✅ Error handling

## 🎨 Animation Examples

The website includes:
- **Hero:** Floating background orbs
- **Stats:** Count-up numbers
- **Cards:** Hover scale effects
- **Images:** Zoom on hover
- **Lists:** Stagger animations
- **Scroll:** Fade-in on view

## 💡 Tips

1. **Performance:** Images are lazy-loaded
2. **SEO:** Metadata is configured
3. **Accessibility:** Proper ARIA labels
4. **Security:** Input validation throughout

## 📞 Need Help?

- Check backend API docs: `Lebbnb-backend/API_DOCUMENTATION.md`
- Review example requests: `Lebbnb-backend/EXAMPLE_REQUESTS.md`
- Check main README: `README.md`

---

**Everything is ready! Start adding your content and customize to your needs.**

🎉 **Happy coding!**
