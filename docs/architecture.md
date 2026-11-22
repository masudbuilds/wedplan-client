# WedPlan Frontend Architecture

## Overview
WedPlan is an editorial, role-based wedding planning marketplace built with Next.js App Router, Tailwind CSS, and ShadCN UI.

## Structure
- `/app` - Pages and layouts (Public, Services, Dashboards)
- `/components` - Reusable design system components
  - `/components/ui` - ShadCN UI primitive components
  - `/components/navbar.tsx` - Responsive header with role-aware profile dropdown
  - `/components/footer.tsx` - Global platform footer
  - `/components/service-card.tsx` - Service presentation card
  - `/components/category-tile.tsx` - Service category tile
  - `/components/stat-card.tsx` - Metrics & KPI card
  - `/components/section-heading.tsx` - Playfair editorial headings
  - `/components/empty-state.tsx` - Zero-state feedback component
  - `/components/loading-skeleton.tsx` - Skeleton states for loading
  - `/components/premium-badge.tsx` - Gold badge for premium vendors
  - `/components/dashboard-shell.tsx` - Dashboard layout with responsive sidebar
- `/lib` - Utilities and shared client helpers (`/lib/api.ts`, `/lib/utils.ts`)
- `/hooks` - Custom React hooks (`useIsMobile`, etc.)
- `/types` - TypeScript interfaces derived from the assignment specifications
- `/docs` - Architecture and project documentation
