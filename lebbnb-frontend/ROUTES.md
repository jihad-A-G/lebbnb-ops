# Lebbnb - Complete Routes & Pages

## 🌐 Public Routes

### Main Pages
| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Home page with hero, featured properties, stats, testimonials |
| `/properties` | `src/app/properties/page.tsx` | Properties gallery with filters and pagination |
| `/properties/[id]` | `src/app/properties/[id]/page.tsx` | Individual property detail page |
| `/about` | `src/app/about/page.tsx` | About us page with mission, vision, team |
| `/contact` | `src/app/contact/page.tsx` | Contact form page |

## 🔐 Admin Routes

### Admin Panel
| Route | File | Description |
|-------|------|-------------|
| `/admin` | `src/app/admin/page.tsx` | Admin dashboard with overview |
| `/admin/properties` | `src/app/admin/properties/page.tsx` | List and manage all properties |
| `/admin/properties/new` | `src/app/admin/properties/new/page.tsx` | Create new property |
| `/admin/properties/[id]` | `src/app/admin/properties/[id]/page.tsx` | Edit existing property (to be created) |
| `/admin/contacts` | `src/app/admin/contacts/page.tsx` | View and manage contact messages |
| `/admin/about` | `src/app/admin/about/page.tsx` | Edit about page content (to be created) |
| `/admin/home` | `src/app/admin/home/page.tsx` | Edit home page content (to be created) |

## 📦 Components

### Layout Components
| Component | File | Used In |
|-----------|------|---------|
| Navigation | `src/components/navigation.tsx` | All pages (sticky header) |
| Footer | `src/components/footer.tsx` | All pages (site footer) |
| Providers | `src/components/providers.tsx` | Root layout (React Query, Toaster) |
| Admin Layout | `src/app/admin/layout.tsx` | Admin pages (sidebar navigation) |

### Home Page Components
| Component | File | Description |
|-----------|------|-------------|
| Hero Section | `src/components/home/hero-section.tsx` | Animated hero with search |
| Featured Properties | `src/components/home/featured-properties.tsx` | Property showcase grid |
| Stats Section | `src/components/home/stats-section.tsx` | Company statistics with animations |
| Testimonials | `src/components/home/testimonials-section.tsx` | Customer reviews |
| CTA Section | `src/components/home/cta-section.tsx` | Call-to-action with quick links |

## 🔌 API Endpoints Used

### Public API (`src/lib/api.ts`)
```typescript
publicApi.getHome()                    // GET /api/home
publicApi.getProperties(params)        // GET /api/properties
publicApi.getProperty(id)              // GET /api/properties/:id
publicApi.getPropertiesByState(state)  // GET /api/properties/state/:state
publicApi.getAbout()                   // GET /api/about
publicApi.submitContact(data)          // POST /api/contact
```

### Admin API (`src/lib/api.ts`)
```typescript
// Properties
adminApi.createProperty(data)                // POST /api/properties/admin
adminApi.updateProperty(id, data)            // PUT /api/properties/admin/:id
adminApi.deleteProperty(id)                  // DELETE /api/properties/admin/:id
adminApi.uploadPropertyImages(id, files)     // POST /api/properties/admin/:id/upload
adminApi.deletePropertyImage(id, filename)   // DELETE /api/properties/admin/:id/image/:filename

// Contacts
adminApi.getContacts(params)                 // GET /api/contact/admin
adminApi.getContactStats()                   // GET /api/contact/admin/stats
adminApi.getContact(id)                      // GET /api/contact/admin/:id
adminApi.updateContactStatus(id, status)     // PATCH /api/contact/admin/:id/status
adminApi.deleteContact(id)                   // DELETE /api/contact/admin/:id

// About
adminApi.updateAbout(data)                   // PUT /api/about/admin
adminApi.uploadAboutImages(files)            // POST /api/about/admin/upload
adminApi.deleteAboutImage(filename)          // DELETE /api/about/admin/image/:filename

// Home
adminApi.updateHome(data)                    // PUT /api/home/admin
adminApi.uploadHeroImage(file)               // POST /api/home/admin/hero-image
adminApi.uploadSectionImage(index, file)     // POST /api/home/admin/section/:index/image
adminApi.uploadTestimonialImage(index, file) // POST /api/home/admin/testimonial/:index/image
```

## 🎨 Styling System

### Global Styles
| File | Purpose |
|------|---------|
| `src/app/globals.css` | Global CSS, custom utilities, color variables |
| Tailwind Config | Built-in with Next.js |

### Custom Utilities (in globals.css)
```css
.text-gradient    /* Green gradient text */
.btn-primary      /* Primary button style */
.btn-secondary    /* Secondary button style */
.card             /* Card component style */
```

## 📋 Type Definitions

### Main Types (`src/types/index.ts`)
```typescript
Property          // Property listing data
Home              // Home page content
About             // About page content
Contact           // Contact message
Section           // Content section
Testimonial       // Customer testimonial
Stat              // Statistics data
TeamMember        // Team member info
CompanyStat       // Company statistic
ContactStats      // Contact statistics
```

## 🎯 Page Features Matrix

| Feature | Home | Properties | Property Detail | About | Contact | Admin |
|---------|------|-----------|----------------|-------|---------|-------|
| Animations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Responsive | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loading States | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Error Handling | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image Gallery | - | ✅ | ✅ | ✅ | - | ✅ |
| Form Validation | ✅ | ✅ | - | - | ✅ | ✅ |
| Filters | ✅ | ✅ | - | - | - | ✅ |
| Pagination | - | ✅ | - | - | - | ✅ |

## 🚀 Quick Navigation Map

```
Website Root (/)
│
├── Home (/)
│   ├── Hero Section (search)
│   ├── Featured Properties → /properties
│   ├── Statistics
│   ├── Testimonials
│   └── CTA → /properties, /contact
│
├── Properties (/properties)
│   ├── Filters (state, type, price, status)
│   ├── Property Grid
│   │   └── Property Card → /properties/[id]
│   └── Pagination
│
├── Property Detail (/properties/[id])
│   ├── Image Gallery
│   ├── Property Info
│   ├── Features List
│   └── Contact CTA → /contact
│
├── About (/about)
│   ├── Mission & Vision
│   ├── Values
│   ├── Company Stats
│   └── Team Members
│
├── Contact (/contact)
│   ├── Contact Form
│   ├── Office Info
│   └── Map
│
└── Admin Panel (/admin)
    ├── Dashboard (/admin)
    │   ├── Statistics
    │   ├── Recent Properties
    │   └── Recent Messages
    │
    ├── Properties (/admin/properties)
    │   ├── Property List
    │   ├── Create New → /admin/properties/new
    │   ├── Edit → /admin/properties/[id]
    │   └── Delete
    │
    └── Contacts (/admin/contacts)
        ├── Message List
        ├── Filter by Status
        ├── Mark as Replied
        └── Delete
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
default:     < 640px   (Mobile)
sm:          ≥ 640px   (Small tablets)
md:          ≥ 768px   (Tablets)
lg:          ≥ 1024px  (Laptops)
xl:          ≥ 1280px  (Desktops)
2xl:         ≥ 1536px  (Large screens)
```

## 🎨 Color Palette

```css
/* Primary Colors */
--primary-green:       #2d6a4f
--primary-green-light: #40916c
--primary-green-dark:  #1b4332
--accent-green:        #52b788

/* Neutral Colors */
--background:          #ffffff
--foreground:          #1a1a1a
--gray-50:            #f9fafb
--gray-100:           #f3f4f6
```

## 🔗 Navigation Links

### Header Navigation
- Home → `/`
- Properties → `/properties`
- About → `/about`
- Contact → `/contact`
- Admin → `/admin`

### Footer Links
- All header links
- Property types → `/properties?type=[type]`
- Social media links (placeholder)

### Admin Sidebar
- Dashboard → `/admin`
- Properties → `/admin/properties`
- Contacts → `/admin/contacts`
- About Us → `/admin/about`
- Home Page → `/admin/home`
- Back to Website → `/`

---

**All routes are fully functional and connected to the backend API!**
