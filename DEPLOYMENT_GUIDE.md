# Onetapay Deployment Guide

## Overview
This guide covers deploying the Onetapay Telegram channel subscription platform from a private GitHub repository to Vercel.

## Deployment Workflow

### Step 1: GitHub Repository Setup
1. **Create private repository in your GitHub account:**
   - Repository name: `onetapay-telegram-platform`
   - Set to **Private**
   - Initialize with current codebase

2. **Invite client as collaborator:**
   - Go to repository Settings > Collaborators
   - Add client's GitHub username
   - Grant "Admin" or "Maintain" permissions

### Step 2: Client Vercel Deployment
1. **Client connects GitHub to Vercel:**
   - Sign in to [vercel.com](https://vercel.com)
   - Connect GitHub account
   - Import the private repository

2. **Deployment configuration:**
   - **Framework:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Step 3: Environment Variables
Client must configure these in Vercel dashboard:

```env
# Database
CUSTOMER_DATABASE_URL=postgresql://[neon_connection_string]

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_live_[your_key_id]
RAZORPAY_KEY_SECRET=rzp_live_[your_secret]
VITE_RAZORPAY_KEY_ID=rzp_live_[your_key_id]

# Firebase Authentication
VITE_FIREBASE_API_KEY=AIza[your_firebase_api_key]
VITE_FIREBASE_PROJECT_ID=[your_project_id]
VITE_FIREBASE_APP_ID=1:[your_app_id]

# Session Management
SESSION_SECRET=[random_32_character_string]
```

### Step 4: External Service Configuration

#### Firebase Setup
1. **Add authorized domains:**
   - Go to Firebase Console > Authentication > Settings
   - Add production domain: `your-app.vercel.app`
   - Add custom domain if applicable

#### Razorpay Setup
1. **Update webhook URLs:**
   - Go to Razorpay Dashboard > Webhooks
   - Add production callback URL if needed

### Step 5: Database Migration
```bash
# Run on deployment
npm run db:push
```

### Step 6: Testing Checklist
- [ ] Homepage loads correctly
- [ ] User authentication works
- [ ] Payment flow completes
- [ ] Dashboard displays subscriptions
- [ ] Telegram links function properly

## File Structure
```
dist/
├── public/           # Frontend build (Vite)
│   ├── index.html
│   ├── assets/
│   └── ...
└── index.js          # Backend bundle (esbuild)
```

## Troubleshooting

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs in Vercel dashboard

### Database Connection Issues
- Verify CUSTOMER_DATABASE_URL is correct
- Check Neon database is accessible
- Confirm SSL settings

### Authentication Problems
- Verify Firebase configuration
- Check authorized domains
- Confirm environment variables

### Payment Issues
- Verify Razorpay keys are correct
- Check webhook configurations
- Test with small amounts first

## Security Considerations
- All API keys are server-side only (except VITE_ prefixed)
- Database connections use SSL
- Session secrets are environment-specific
- Private repository ensures code security

## Maintenance
- Regular dependency updates
- Monitor Vercel deployment logs
- Database backup recommendations
- Performance monitoring setup