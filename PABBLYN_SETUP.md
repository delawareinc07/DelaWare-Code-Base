# Pabblyn Metropolitan College - Platform Setup Guide

## Overview

Pabblyn is a production-ready, fully integrated platform for an online catering school. It combines:

- **Public Website** - Marketing and information pages
- **Learning Management System (LMS)** - Programmes, training content, discussions
- **Student Portal** - Enrollment, payments, certificates
- **Teacher Portal** - Course management, student oversight
- **Catering Ordering System** - Products, shopping cart, WhatsApp integration
- **Admin Dashboard** - Complete platform management

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vite + npm
- **Brand Colors**: Navy Blue (#001F3F) + Gold (#FFD700)

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Add your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Database Setup

Run all migrations in your Supabase SQL editor:

```bash
# 1. Roles and profiles
supabase/migrations/0001_roles_and_profiles.sql

# 2. Programmes and enrollment
supabase/migrations/0002_programmes_and_enrollment.sql

# 3. Training content and discussions
supabase/migrations/0003_training_content_and_discussions.sql

# 4. Products and orders
supabase/migrations/0004_catering_products_and_orders.sql

# 5. Gallery, testimonials, and settings
supabase/migrations/0005_gallery_testimonials_and_settings.sql
```

### 3. Create Default Admin

After migrations, create the first admin account via Supabase Auth:

```sql
-- In Supabase SQL Editor, after user signup
insert into public.user_roles (user_id, role)
values ('<user-uuid>', 'super_admin');
```

Default credentials for demo:
- Email: admissions@pabblyncollege.edu
- Password: P@bblyn2026!

### 4. Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Platform Architecture

### User Roles

- **Super Admin**: Full platform access, system settings
- **Admin**: User management, content moderation, payment approval
- **Teacher**: Create courses, upload training, manage students
- **Student**: Enroll in programmes, pay fees, upload content, access learning materials
- **Visitor**: Browse public pages (no auth required)

### Access Control

Access is controlled by:
1. **Role-based routing** - Protected pages check user roles
2. **Row-level security (RLS)** - Database enforces access at record level
3. **Payment status** - Students with overdue payments have restricted access

### Payment System

Students pay per programme with flexible options:
- **Full Payment** - Pay entire fee upfront
- **Part Payment** - Pay initial amount, extend deadline
- **Installments** - Multiple smaller payments over time

Admin tracks:
- Amount paid
- Outstanding balance
- Payment deadline
- Payment history
- Access status (locked if overdue)

## Admin Dashboard

### Programmes Management
- Create/edit/delete programmes
- Set fees, duration, certification
- Mark as featured or active
- View enrolled students

**URL**: `/admin/programmes`

### Products Management
- Create catering products/services
- Organize by category (food, pastries, desserts, services, etc.)
- Set pricing and availability
- Upload images

**URL**: `/admin/products`

### Delivery Cities
- Configure delivery zones
- Set delivery fees and service charges
- Automatic calculation during checkout

**URL**: `/admin/delivery`

### Payment Management
- View all student enrollments
- Record payments manually
- Approve/reject payments
- Lock accounts for overdue payments
- Extend payment deadlines

**URL**: `/admin/payments`

### Gallery Management
- Upload images/videos by category
- Organize visual content
- Mark featured items

**URL**: `/admin/gallery`

### Testimonials
- Add student/client testimonials
- Organize by category (student, graduate, catering client, corporate client)
- Mark featured for homepage

**URL**: `/admin/testimonials`

### Site Settings
- Brand colors and logo
- Contact information
- Social media links
- WhatsApp integration
- Feature toggles (animations, LMS, catering)

**URL**: `/admin/settings`

## Student Portal Features

### Programmes (`/student/programmes`)
- Browse available programmes
- Enroll with one click
- Track enrolled programmes
- View payment status per programme

### Payments (`/student/payments`)
- View total paid vs outstanding
- Payment status by programme
- Payment history and receipts
- Payment progress visualization

### Learning Library (`/student/library`)
- Access training materials
- Watch videos, download PDFs
- Read notes and resources
- View training discussions

### My Uploads (`/student/uploads`)
- Upload practical demonstrations
- Share recipes and tutorials
- Control content visibility
- Get community feedback

### Projects (`/student/projects`)
- Submit project work
- Showcase catering events
- Share business ideas
- Get featured projects

### Certificates (`/student/certificates`)
- View issued certificates
- Download PDFs
- Share achievements

## Catering Ordering System

### Customer Flow

1. **Browse Products** (`/products-services`)
   - Browse by category
   - View pricing and descriptions

2. **Add to Cart**
   - Quantity management
   - Real-time price updates

3. **Checkout**
   - Enter delivery details
   - Select delivery city
   - View fees and totals

4. **WhatsApp Integration**
   - Order sent to WhatsApp
   - Admin receives notification
   - Customer confirms via message

### Admin Configuration

**Delivery Cities** (`/admin/delivery`)
- Add cities
- Set delivery fees
- Set service charges

**Products** (`/admin/products`)
- Add/edit products
- Manage categories
- Set pricing
- Mark availability

**Settings** (`/admin/settings`)
- Configure WhatsApp number
- Customize order template
- Enable/disable ordering

## Learning Management System

### Training Content

Teachers can upload:
- Video lessons
- PDF notes
- Images/diagrams
- Audio recordings
- Text resources

**Visibility Options**:
- Public to everyone
- Students only
- Specific programme members
- Private (instructor only)
- Admin only

### Discussions & Comments

Under each training:
- Students and teachers post comments
- Reply to discussions
- Teachers can pin important comments
- Admin can moderate/delete
- Like and react to comments

### User-Generated Content

Students can:
- Upload their own training content
- Share practical demonstrations
- Contribute tutorials
- Submit projects
- Share business lessons

Teachers can:
- Feature student content
- Review submissions
- Moderate discussions
- Award points/badges

## Email & Notifications

Automatic emails/notifications for:
- New enrolments
- Payment reminders
- Overdue payment warnings
- Certificate issuance
- Course announcements
- New discussion replies

Configure templates in:
`/admin/settings` → Notifications

## Best Practices

### For Admins

1. **Onboarding**
   - Create teacher accounts first
   - Assign teachers to programmes
   - Set up delivery cities and products
   - Configure site settings

2. **Payments**
   - Set reasonable deadlines (30+ days)
   - Review overdue accounts weekly
   - Approve legitimate payments quickly
   - Communicate deadline extensions

3. **Content**
   - Feature best student content
   - Refresh testimonials regularly
   - Update gallery monthly
   - Keep products stocked

### For Teachers

1. **Course Setup**
   - Create clear module structure
   - Upload diverse content types
   - Set discussion prompts
   - Review student submissions

2. **Student Engagement**
   - Pin important announcements
   - Respond to discussions quickly
   - Feature quality student work
   - Provide constructive feedback

### For Students

1. **Learning**
   - Enroll in one programme at a time
   - Complete payments promptly
   - Participate in discussions
   - Upload quality project work

2. **Contributions**
   - Share helpful resources
   - Contribute tutorials
   - Showcase projects
   - Engage respectfully

## Deployment

### Deploy to Production

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy to your hosting
# (Netlify, Vercel, or traditional server)
```

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
```

### Database Backups

Enable automatic backups in Supabase dashboard:
- Daily backups (minimum 7 days retention)
- Point-in-time recovery

## Troubleshooting

### Can't Log In

- Check email spelling
- Verify account exists in Supabase Auth
- Clear browser cookies/cache
- Check Supabase auth settings

### Missing Permissions

- Verify user role in `user_roles` table
- Check RLS policies in Supabase
- Ensure auth session is valid
- Check network/CORS issues

### Payment Issues

- Verify programme fee is set
- Check payment deadline is in future
- Ensure payment status is correct
- Check for locked student accounts

### Content Not Showing

- Verify content visibility/RLS
- Check if user meets access requirements
- Check if programme is active
- Verify payment status is not locked

## Support & Documentation

- Supabase Docs: https://supabase.com/docs
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://www.typescriptlang.org

## License

Built by DelaWare Inc. BAAS System

---

**Last Updated**: June 2026
**Version**: 1.0.0
