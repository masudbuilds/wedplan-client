# WedPlan — Curated Wedding Services Marketplace

> An editorial, role-based wedding planning marketplace connecting couples with premier wedding photographers, venues, florists, caterers, makeup artists, and wedding fashion specialists.

---

## Table of Contents
- [Overview](#overview)
- [Key Features by Role](#key-features-by-role)
  - [Public & Visitors](#1-public--visitors)
  - [Customer (Couples & Planners)](#2-customer-couples--planners)
  - [Wedding Vendors](#3-wedding-vendors)
  - [Platform Administrators](#4-platform-administrators)
- [Technology Stack](#technology-stack)
- [Architecture & Security Highlights](#architecture--security-highlights)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Testing Credentials](#testing-credentials)
- [Stripe Test Card Information](#stripe-test-card-information)
- [Deployment Guide](#deployment-guide)

---

## Overview

WedPlan provides a seamless experience for wedding planning. Couples can discover verified wedding services, filter by category and location, and place booking requests. Wedding vendors can manage their portfolio, service packages, and incoming booking requests, as well as upgrade to a Premium tier via Stripe. Administrators have complete moderation capabilities over users, services, and transactions.

---

## Key Features by Role

### 1. Public & Visitors
- **Editorial Homepage (`/`)**:
  - Hero banner with typography inspired by wedding editorials and direct CTA to explore services.
  - Interactive service categories (Photography & Videography, Wedding Venues, Decoration & Florist, Catering Services, Makeup & Styling, Wedding Fashion).
  - Featured & verified services showcase with vendor badges, pricing, and ratings.
  - "Why Choose Us" value propositions, "How It Works" 3-step guide, testimonials, interactive FAQ accordion, and footer.
- **Browse Services (`/services`)**:
  - Live search by service title and description.
  - Category selector synchronized with URL query parameters (`?category=...`).
  - Location search/filter.
  - Sort by "Default", "Price: Low to High", and "Price: High to Low".
  - One-click "Clear Filters" button.
  - Skeletons, zero-state illustrations, and responsive pagination.
- **Service Details (`/services/[id]`)**:
  - High-resolution photo gallery with thumbnails.
  - Service breakdown, inclusions, and location.
  - Vendor profile with "Premium Vendor" badge.
  - Availability status with responsive booking modal.
  - Unauthenticated booking attempts automatically redirect to sign-in with a preserved return URL.

### 2. Customer (Couples & Planners)
- **Role-Guarded Customer Dashboard (`/dashboard/customer`)**:
  - Overview KPI metrics: Total Bookings, Pending Bookings, Accepted Bookings, and Completed Celebrations.
  - Quick action shortcuts to explore services and update profile settings.
- **My Bookings (`/dashboard/customer/bookings`)**:
  - Real-time search and status filtering (All, Pending, Accepted, Rejected, Completed, Cancelled).
  - Desktop data table and mobile-friendly responsive card views.
  - Interactive booking details modal with vendor notes.
  - Cancellation dialog with reason selection for active bookings.
- **Profile Settings (`/dashboard/customer/profile`)**:
  - Direct profile photo upload via ImgBB.
  - Name and contact update.
  - Role and email are strictly read-only to prevent self-privilege escalation.

### 3. Wedding Vendors
- **Role-Guarded Vendor Dashboard (`/dashboard/vendor`)**:
  - Overview KPI stat cards: Total Services, Active Packages, Pending Booking Requests, Accepted Bookings.
  - Gold "Premium Vendor" badge displayed across the vendor dashboard when subscribed.
- **My Services (`/dashboard/vendor/services`)**:
  - Full CRUD for service packages: Create (`/dashboard/vendor/services/new`), Edit (`/dashboard/vendor/services/[id]/edit`), and Delete.
  - Instant toggle for service availability (Active vs. Inactive).
  - Multi-image uploader supporting high-resolution wedding photos.
- **Booking Requests (`/dashboard/vendor/bookings`)**:
  - Filter requests by status (Pending, Accepted, Rejected, Completed).
  - One-click Accept and Reject workflows.
  - Mark completed upon event date with optional completion notes.
- **Subscription & Billing (`/dashboard/vendor/subscription`)**:
  - Tier comparison (Free vs. Premium $29/mo).
  - Premium benefits: Unlimited active listings, verified gold badge, featured homepage placement, priority search ranking.
  - Stripe Checkout integration for seamless and secure payment processing.
  - Real-time subscription cancellation and expiration tracking (`subscriptionExpiresAt`).
- **Profile Settings (`/dashboard/vendor/profile`)**:
  - Business / Studio name management, bio, profile photo, and contact details.

### 4. Platform Administrators
- **Role-Guarded Admin Dashboard (`/dashboard/admin`)**:
  - Platform-wide KPI stats: Total Registered Users, Total Vendors, Total Customers, Total Services, Pending Services, Total Transactions.
  - Direct deep-links from pending metric cards to filtered moderation views.
- **User Management (`/dashboard/admin/users`)**:
  - Search by user name or email.
  - Filter by role (Customer, Vendor, Admin).
  - Block and unblock user accounts with confirmation dialogs.
  - User details modal with full profile, role, status, and creation date.
- **Service Moderation (`/dashboard/admin/services`)**:
  - Search services by title, category, or status (Pending, Approved, Rejected).
  - One-click Approve and Reject actions.
  - Admin deletion of non-compliant listings with confirmation dialogs.
  - Deep-link to public service preview.
- **Transaction Ledger (`/dashboard/admin/transactions`)**:
  - Read-only audit log of all Stripe subscription payments.
  - Displays Transaction ID, Vendor Name, Stripe Session ID, Amount ($29.00 USD), Status, and Date.

---

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions, Route Handlers, Proxy convention)
- **UI & Components**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Base UI](https://base-ui.com/), [Lucide React Icons](https://lucide.dev/)
- **Typography**: Playfair Display (Serif) & Inter (Sans-Serif)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) toast system
- **Authentication**: [Better Auth](https://www.better-auth.com/) (MongoDB Adapter, JWT with JWKS EdDSA signing, Google OAuth)
- **Database**: [MongoDB](https://www.mongodb.com/) (Collections: `users`, `sessions`, `services`, `bookings`, `transactions`)
- **Payments**: [Stripe](https://stripe.com/) Checkout Sessions & Customer Portal
- **Image Hosting**: [ImgBB API](https://imgbb.com/) with server-side validation and authentication guards

---

## Architecture & Security Highlights

1. **Authentication Architecture**:
   - Better Auth runs directly within Next.js and connects to MongoDB (`users` and `sessions` collections).
   - Better Auth JWT plugin signs tokens using EdDSA and exposes public JWKS at `/api/auth/jwks`.
   - The Express backend independently verifies these JWT tokens against the Next.js JWKS endpoint.
   - The client `apiFetch` helper automatically attaches the JWT Bearer token to all private API requests.
2. **Access Control & Role Guards**:
   - The lightweight Next.js proxy (`proxy.ts`) checks for authenticated session cookies (`better-auth.session_token` and `__Secure-better-auth.session_token`).
   - `DashboardShell` enforces client-side role validation (`customer`, `vendor`, `admin`) and redirects unauthorized users.
   - Admins cannot be created via public sign-up or Google OAuth (restricted to `"customer"` default in database hooks).
   - Profile updates strictly strip `role`, `isBlocked`, and subscription fields to prevent self-privilege escalation.
   - Suspended/blocked users are immediately blocked from creating new sessions and are signed out on API calls.
3. **Open-Redirect Protection**:
   - Query parameter redirects (`?redirect=...`) are strictly validated against external and malicious protocols (`//`, `http://`, `https://`).
   - The same validation is enforced across both email and Google OAuth authentication flows.
4. **Image Upload Protection**:
   - Image upload endpoint (`/api/upload`) requires an authenticated session.
   - Validates file MIME types (`image/jpeg`, `image/png`, `image/webp`) and enforces a 5MB size limit.
   - Development mock fallback is strictly disabled in production.

---

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your_32_character_random_secret_here
BETTER_AUTH_URL=http://localhost:3000

# MongoDB Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
DB_NAME=wedplan

# Google OAuth Credentials (Optional for local, required for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB API Key (Server-side image hosting)
IMGBB_API_KEY=your_imgbb_api_key

# Backend API URL (Express.js server)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Client Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Environment Variables Checklist
When deploying to Vercel, Render, or Railway, provide:
- `BETTER_AUTH_SECRET`: Generate a random 32+ character string (`openssl rand -hex 32`).
- `BETTER_AUTH_URL`: Your production client URL (e.g., `https://wedplan.vercel.app`).
- `MONGODB_URI`: Production MongoDB Atlas connection URI.
- `DB_NAME`: Database name (e.g., `wedplan`).
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Configured in Google Cloud Console with authorized redirect URI `https://<your-domain>/api/auth/callback/google`.
- `IMGBB_API_KEY`: ImgBB account API key for user and service photos.
- `NEXT_PUBLIC_API_URL`: Production URL of your Express API server (e.g., `https://api.wedplan.com/api`).
- `NEXT_PUBLIC_APP_URL`: Your production client URL (e.g., `https://wedplan.vercel.app`).

---

## Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm or yarn
- MongoDB Atlas cluster or local MongoDB instance
- Running WedPlan Express server (`wedplan-server`) on port 5000

### Installation

1. Navigate to the client directory:
   ```bash
   cd wedplan-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Fill in BETTER_AUTH_SECRET, MONGODB_URI, etc.
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing Credentials

You can use the following pre-configured test accounts to review the three distinct platform roles:

| Role | Email | Password | Access / Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@wedplan.com` | `Admin123!` | `/dashboard/admin` (Full moderation) |
| **Vendor (Premium)** | `vendor@wedplan.com` | `Vendor123!` | `/dashboard/vendor` (Services, Bookings, Subscription) |
| **Customer** | `couple@wedplan.com` | `Customer123!` | `/dashboard/customer` (Bookings, Profile) |

*Note: You can also register a fresh Customer or Vendor account anytime at `/sign-up`.*

---

## Stripe Test Card Information

For testing the Vendor Premium subscription flow at `/dashboard/vendor/subscription`:

- **Card Number**: `4242 •••• •••• 4242` (Enter `4242424242424242`)
- **Expiration Date**: Any valid future month and year (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **Postal Code**: Any valid postal code (e.g., `90210`)

---

## Deployment Guide

### Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project in Vercel. Set the root directory to `wedplan-client`.
3. Configure the Production Environment Variables listed above.
4. Ensure `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` match your assigned Vercel URL (e.g., `https://wedplan.vercel.app`).
5. In Google Cloud Console, add `https://<your-vercel-domain>/api/auth/callback/google` to the **Authorized redirect URIs**.
6. In Stripe Dashboard, configure the webhook endpoint pointing to your Express server (`https://<api-domain>/api/payments/webhook`).
7. Deploy!
