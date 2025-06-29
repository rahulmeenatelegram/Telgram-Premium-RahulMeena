# TeleChannels - Firebase-Based Telegram Channel Access Platform

## Overview

TeleChannels is a full-stack subscription-based web application that provides recurring access to premium Telegram channels. The platform now uses Firebase for authentication and database, with an integrated admin wallet system for payment management through Razorpay.

## System Architecture

The application follows a Firebase-first architecture with complete client-side data management:

- **Frontend**: React with TypeScript, using Vite for development and build
- **Authentication**: Firebase Authentication with Google OAuth
- **Database**: Firebase Firestore for real-time data storage
- **Admin Wallet**: Comprehensive wallet system for payment tracking and withdrawals
- **Payment Processing**: Razorpay integration for handling transactions with wallet credits
- **UI Framework**: Tailwind CSS with Radix UI components via shadcn/ui

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite bundler
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for Firebase data management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Forms**: React Hook Form with Zod validation

### Firebase Architecture
- **Authentication**: Firebase Auth with Google OAuth provider
- **Database**: Cloud Firestore for real-time document storage
- **Security**: Firebase Security Rules for data access control
- **Hosting**: Client-side only architecture with direct Firebase integration

### Admin Wallet System
- **Wallet Management**: Comprehensive balance tracking and transaction history
- **Payment Integration**: Razorpay for payment processing with automatic wallet credits
- **Withdrawal System**: Multiple withdrawal methods (UPI, Bank Transfer, Digital Wallet)
- **Analytics**: Real-time revenue tracking and user metrics

### Firestore Collections
The application uses these main collections:
- **users**: User profiles with role-based access (user/admin)
- **channels**: Telegram channel definitions with subscription pricing
- **payments**: Payment transaction records with Razorpay integration
- **subscriptions**: Active recurring subscriptions with billing management
- **adminWallet**: Central wallet for tracking admin earnings
- **adminWalletTransactions**: Detailed transaction history for wallet operations
- **adminWithdrawals**: Withdrawal requests and processing status

## Data Flow

1. **User Authentication**: Google OAuth sign-in via Firebase Authentication
2. **Channel Discovery**: Users browse available subscription channels stored in Firestore
3. **Subscription Process**: Users select channels and initiate payment through Razorpay
4. **Payment Processing**: Razorpay handles payment with webhook integration
5. **Wallet Credit**: Successful payments automatically credit the admin wallet
6. **Access Provisioning**: Users receive Telegram access links upon payment confirmation
7. **Admin Dashboard**: Real-time analytics and wallet management through Firebase queries
8. **Withdrawal System**: Admins can request withdrawals with multiple payment methods

## External Dependencies

### Firebase Services
- **Firebase Authentication**: Google OAuth provider for user authentication
- **Cloud Firestore**: NoSQL document database for real-time data storage
- Environment variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`

### Payment Processing
- **Razorpay**: Primary payment gateway for handling UPI and card transactions
- Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Icons**: Additional icon sets including Font Awesome

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

- June 26, 2025. Initial setup
- June 26, 2025. Fixed authentication system to use email-based login, resolved Razorpay payment integration, added test channel for 2 rupees
- June 26, 2025. Enhanced admin dashboard with working withdrawal system, fixed validation errors, admin role assigned to main user
- June 26, 2025. Converted to subscription-based autopay platform with recurring billing, monthly/yearly options, subscription management, and cancel-anytime functionality
- June 29, 2025. **Major Architecture Migration**: Completely migrated from PostgreSQL to Firebase
  - Implemented Firebase Authentication with Google OAuth
  - Migrated all data storage to Cloud Firestore
  - Built comprehensive admin wallet system with real-time balance tracking
  - Added multi-method withdrawal system (UPI, Bank Transfer, Digital Wallet)
  - Created Firebase-based analytics dashboard
  - Simplified authentication flow with single Google sign-in
  - Enhanced admin-only access controls
  - Improved real-time data synchronization

## User Preferences

Preferred communication style: Simple, everyday language.