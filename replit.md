# Onetapay - Telegram Channel Access Platform

## Overview

Onetapay is a full-stack subscription-based web application that provides recurring access to premium Telegram channels. The platform handles subscription billing with autopay through Razorpay, manages user authentication, and provides admin tools for subscription management and analytics.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React with TypeScript, using Vite for development and build
- **Backend**: Express.js with TypeScript for API and authentication
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy and session management
- **Payment Processing**: Razorpay integration for handling transactions
- **UI Framework**: Tailwind CSS with Radix UI components via shadcn/ui

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite bundler
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy using scrypt for password hashing
- **Session Management**: Express sessions with PostgreSQL store
- **Database Layer**: Drizzle ORM with Neon serverless PostgreSQL
- **Payment Integration**: Razorpay for handling order creation and payment verification

### Database Schema
The application uses six main tables:
- **users**: User accounts with role-based access (user/admin)
- **channels**: Telegram channel definitions with subscription pricing and billing periods
- **subscriptions**: Active recurring subscriptions with billing schedules and autopay management
- **payments**: Payment transaction records including subscription payments with Razorpay integration
- **purchases**: User channel access records with generated access links
- **withdrawals**: Admin withdrawal requests and processing

## Data Flow

1. **Channel Discovery**: Users browse available subscription channels on the homepage
2. **Subscription Process**: Users select a channel, choose billing period (monthly/yearly), provide email
3. **Subscription Creation**: Backend creates subscription record with billing schedule
4. **Payment Processing**: Frontend handles Razorpay payment modal with autopay setup
5. **Payment Verification**: Backend verifies payment signature and activates subscription
6. **Access Provisioning**: System provides unique Telegram access link with recurring billing
7. **Autopay Management**: System tracks billing cycles and processes automatic renewals
8. **Admin Management**: Admins can manage subscriptions, view analytics, and process withdrawals

## External Dependencies

### Payment Processing
- **Razorpay**: Primary payment gateway for handling UPI and card transactions
- Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- Environment variable: `DATABASE_URL`

### Session Management
- **PostgreSQL Session Store**: Sessions stored in database for persistence
- Environment variable: `SESSION_SECRET`

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Font Awesome**: Icon classes for channel categorization

## Deployment Strategy

The application is configured for deployment on Replit with autoscaling:

- **Development**: `npm run dev` starts both frontend and backend in development mode
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Production**: Static files served by Express with API routes
- **Database Migrations**: Drizzle Kit handles schema changes with `npm run db:push`
- **Environment**: Uses Replit's built-in PostgreSQL and web hosting

### Build Configuration
- Frontend builds to `dist/public` directory
- Backend bundles to `dist/index.js` with external dependencies
- Static file serving integrated into Express server
- Hot module replacement enabled in development

## Changelog

Changelog:
- June 26, 2025. Initial setup
- June 26, 2025. Fixed authentication system to use email-based login, resolved Razorpay payment integration, added test channel for 2 rupees
- June 26, 2025. Enhanced admin dashboard with working withdrawal system, fixed validation errors, admin role assigned to main user
- June 26, 2025. Converted to subscription-based autopay platform with recurring billing, monthly/yearly options, subscription management, and cancel-anytime functionality
- June 29, 2025. Fixed critical database connection issues - resolved "relation does not exist" errors by properly configuring Neon database connection with correct imports and WebSocket configuration
- June 29, 2025. Successfully migrated application to use CUSTOMER_DATABASE_URL endpoint for proper handover, created all tables and sample data in customer's specified database
- June 29, 2025. Connected to customer's specific Neon database endpoint "ep-falling-king-a5lefii6" with full SSL configuration and channel binding requirements
- June 29, 2025. Implemented modern Awwwards-style UI with minimalistic design, background gradients, glass morphism effects, and floating particles for both light and dark modes
- June 29, 2025. Renamed platform to "Onetapay" and implemented complete mobile responsiveness with optimized spacing, typography, and layout for all device sizes
- June 29, 2025. Fixed mobile responsiveness issues - eliminated horizontal scrolling across all components, optimized tables, cards, and grid layouts for perfect mobile experience
- June 29, 2025. Added About and Contact pages with modern design, FAQ section, contact form, and integrated navigation in navbar with active state indicators
- July 8, 2025. Enhanced mobile responsiveness across all pages, removed unnecessary stats from About page, added social media links to Contact page, removed demo buttons, optimized navigation and spacing for all screen sizes
- July 8, 2025. Implemented hamburger menu navigation for mobile devices, removed member counts from channel cards, replaced "Explore Channels" with "Get Started" button, fixed horizontal scrolling issues with proper CSS overflow controls
- July 8, 2025. Migrated authentication system from Passport.js to Firebase Authentication with email verification, password reset functionality, Google sign-in, and comprehensive error handling. Updated protected routes and admin access control.
- July 8, 2025. Implemented manual renewal system with access control using unique access tokens instead of direct Telegram links. Features: 30-day subscription periods, 3-day grace period, access blocking for expired subscriptions, renewal payment processing through Razorpay, and access portal pages that control channel access through tokens rather than direct links.

## User Preferences

Preferred communication style: Simple, everyday language.