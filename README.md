# WedPlan — Curated Wedding Services Marketplace

> An editorial, role-based wedding planning marketplace connecting couples with premier wedding photographers, venues, florists, caterers, makeup artists, and wedding fashion specialists.

- **Live Website**: [https://wedplan-client-pearl.vercel.app](https://wedplan-client-pearl.vercel.app)
- **Live Server API**: [https://wedplan-server-ruddy.vercel.app](https://wedplan-server-ruddy.vercel.app)
- **Client Repository**: [https://github.com/masudbuilds/wedplan-client](https://github.com/masudbuilds/wedplan-client)
- **Server Repository**: [https://github.com/masudbuilds/wedplan-server](https://github.com/masudbuilds/wedplan-server)

---

## Table of Contents
- [Project Overview](#project-overview)
- [Live Links and Repositories](#live-links-and-repositories)
- [Required Application URLs](#required-application-urls)
- [Important Features](#important-features)
  - [1. Public & Visitors](#1-public--visitors)
  - [2. Customer (Couples & Planners)](#2-customer-couples--planners)
  - [3. Wedding Vendors](#3-wedding-vendors)
  - [4. Platform Administrators](#4-platform-administrators)
- [Technology Stack](#technology-stack)
- [Architecture & Security Highlights](#architecture--security-highlights)
- [Environment Variables](#environment-variables)
  - [Production Environment Variables Checklist](#production-environment-variables-checklist)
- [Installation Instructions](#installation-instructions)
- [How to Run Locally](#how-to-run-locally)

---

## Project Overview

WedPlan provides a seamless, editorial digital experience for wedding planning. Couples can discover verified wedding services, filter by category and location, view transparent pricing, and place booking requests. Wedding vendors can manage their portfolio, service packages, and incoming booking requests, as well as upgrade to a Premium tier via Stripe. Administrators have complete moderation capabilities over users, services, and transactions.

---

## Live Links and Repositories

| Resource | URL |
| :--- | :--- |
| **Live Website** | [https://wedplan-client-pearl.vercel.app](https://wedplan-client-pearl.vercel.app) |
| **Live Server API** | [https://wedplan-server-ruddy.vercel.app](https://wedplan-server-ruddy.vercel.app) |
| **Client Repository** | [https://github.com/masudbuilds/wedplan-client](https://github.com/masudbuilds/wedplan-client) |
| **Server Repository** | [https://github.com/masudbuilds/wedplan-server](https://github.com/masudbuilds/wedplan-server) |

---

## Required Application URLs

| Variable / Endpoint | Production Value | Description |
| :--- | :--- | :--- |
| **`BETTER_AUTH_URL`** | `https://wedplan-client-pearl.vercel.app` | Canonical public URL of the Next.js client |
| **`NEXT_PUBLIC_APP_URL`** | `https://wedplan-client-pearl.vercel.app` | Client-accessible base URL |
| **`NEXT_PUBLIC_API_URL`** | `https://wedplan-server-ruddy.vercel.app/api` | Express API base endpoint |
| **Google Redirect URI** | `https://wedplan-client-pearl.vercel.app/api/auth/callback/google` | Authorized Google OAuth callback URL |
| **Server JWKS URL** | `https://wedplan-client-pearl.vercel.app/api/auth/jwks` | Better Auth JWKS endpoint for Express JWT verification |

---

## Important Features

### 1. Public & Visitors
- **Editorial Homepage (`/`)**:
  - Hero banner with typography inspired by wedding editorials and direct CTA to explore services.
  - Interactive service categories (Photography & Videography, Wedding Venues, Decoration & Florist, Catering Services, Makeup & Styling, Wedding Fashion).
  - Featured & verified services showcase with vendor badges, pricing, and ratings.
  - "Why Choose Us" value propositions, "How It Works" 3-step guide, testimonials, interactive FAQ accordion, and footer.
- **Browse Services (`/services`)**:
  - Live search by service title and description.
  - Category selector synchronized with URL query parameters (`?category=...`).
  - Location search and filter.
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

Copy `.env.example` to `.env.local` for local development. Only variable names and descriptions are documented here; never commit real secrets or `.env` files.

| Variable Name | Required | Description |
| :--- | :--- | :--- |
| `BETTER_AUTH_SECRET` | Yes | A 32+ character random secret used by Better Auth to encrypt session cookies and sign tokens |
| `BETTER_AUTH_URL` | Yes | Canonical public URL of the Next.js client (`http://localhost:3000` locally) |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string URI used by the Better Auth MongoDB adapter |
| `DB_NAME` | Yes | MongoDB database name (e.g. `wedplan`) |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth 2.0 Client ID for Google Sign-In |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth 2.0 Client Secret for Google Sign-In |
| `IMGBB_API_KEY` | Yes | ImgBB account API key used on the server side for image uploads |
| `NEXT_PUBLIC_API_URL` | Yes | Public URL of the Express API (`http://localhost:5000/api` locally) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public base URL of the client application (`http://localhost:3000` locally) |

### Production Environment Variables Checklist
When deploying to production (e.g. Vercel), provide the following environment variables:
- `BETTER_AUTH_SECRET`: Random 32+ character secret string.
- `BETTER_AUTH_URL`: `https://wedplan-client-pearl.vercel.app`
- `MONGODB_URI`: Production MongoDB Atlas connection URI.
- `DB_NAME`: Production database name (e.g. `wedplan`).
- `GOOGLE_CLIENT_ID`: Configured in Google Cloud Console with authorized redirect URI `https://wedplan-client-pearl.vercel.app/api/auth/callback/google`.
- `GOOGLE_CLIENT_SECRET`: Matching Google OAuth Client Secret.
- `IMGBB_API_KEY`: Production ImgBB API key.
- `NEXT_PUBLIC_API_URL`: `https://wedplan-server-ruddy.vercel.app/api`
- `NEXT_PUBLIC_APP_URL`: `https://wedplan-client-pearl.vercel.app`

---

## Installation Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/masudbuilds/wedplan-client.git
   cd wedplan-client
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a local environment file from the example template:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and supply your database connection and Better Auth secrets.

---

## How to Run Locally

1. **Ensure the backend server is running**:
   Start the companion Express server (`wedplan-server`) on port 5000:
   ```bash
   cd ../wedplan-server
   npm run dev
   ```

2. **Start the Next.js development client**:
   In the `wedplan-client` directory, run:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.
