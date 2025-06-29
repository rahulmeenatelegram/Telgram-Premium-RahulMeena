# Website Handover Guide

## Live Website
After deployment, your website will be available at: `[YOUR-REPL-NAME].replit.app`

## Admin Access
- **Admin Login**: Use the admin account credentials
- **Admin Dashboard**: Access at `/admin` after logging in
- **Features**: Manage channels, view payments, process withdrawals, view analytics

## Payment Integration
- **Razorpay**: Already integrated for processing payments
- **Supported**: UPI, Credit/Debit cards
- **Subscription**: Automatic recurring billing (monthly/yearly)

## Key Features
1. **Channel Management**: Add/edit Telegram channels with pricing
2. **Subscription System**: Recurring payments with autopay
3. **User Management**: Track subscriptions and purchases  
4. **Analytics**: Revenue tracking and user insights
5. **Withdrawal System**: Admin can withdraw earnings

## Environment Variables Required
Your customer will need to set these in their hosting environment:
- `DATABASE_URL`: PostgreSQL database connection
- `RAZORPAY_KEY_ID`: Razorpay public key
- `RAZORPAY_KEY_SECRET`: Razorpay secret key
- `SESSION_SECRET`: Session encryption key

## Database
- **Type**: PostgreSQL (Neon serverless)
- **Setup**: Database tables are automatically created
- **Management**: Use admin dashboard for content management

## Technical Support
The system is built with:
- React frontend with modern UI
- Express.js backend
- PostgreSQL database
- Razorpay payment processing
- Subscription management with autopay

## Getting Started
1. Access the live website
2. Create admin account or use existing credentials
3. Add your Telegram channels in admin dashboard
4. Configure payment methods
5. Start accepting subscriptions!