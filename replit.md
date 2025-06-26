# TeleChannels - Telegram Channel Access Platform

## Overview

TeleChannels is a full-stack web application that allows users to purchase access to premium Telegram channels. The platform handles payment processing through Razorpay, manages user authentication, and provides admin tools for channel management and analytics.

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
The application uses five main tables:
- **users**: User accounts with role-based access (user/admin)
- **channels**: Telegram channel definitions with pricing and metadata
- **payments**: Payment transaction records with Razorpay integration
- **purchases**: User channel access records with generated access links
- **withdrawals**: Admin withdrawal requests and processing

## Data Flow

1. **Channel Discovery**: Users browse available channels on the homepage
2. **Payment Process**: Users select a channel, provide email, choose payment method
3. **Order Creation**: Backend creates Razorpay order and payment record
4. **Payment Processing**: Frontend handles Razorpay payment modal
5. **Payment Verification**: Backend verifies payment signature and updates records
6. **Access Provisioning**: System creates purchase record with unique Telegram access link
7. **Admin Management**: Admins can manage channels, view analytics, and process withdrawals

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

## User Preferences

Preferred communication style: Simple, everyday language.