# Complete Deployment Guide for Customer

## Step 1: Get Your Database (FREE)
1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string (looks like: `postgresql://username:password@host/database`)
4. Save this as your `DATABASE_URL`

## Step 2: Set Up Payments
1. Sign up at https://razorpay.com
2. Get your Test/Live API keys from the dashboard
3. Save `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

## Step 3: Deploy Your Website
Choose one of these platforms:

### Option A: Vercel (Recommended)
1. Fork/download the code
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Option B: Railway
1. Connect your code repository
2. Add environment variables
3. Deploy with one click

### Option C: Render
1. Create new web service
2. Connect repository
3. Set environment variables
4. Deploy

## Step 4: Environment Variables
Set these in your hosting platform:
```
DATABASE_URL=your_neon_database_url
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SESSION_SECRET=any_random_32_character_string
```

## Step 5: First Login
1. Visit your deployed website
2. Register the first admin account
3. Go to `/admin` to manage channels
4. Add your Telegram channels with pricing

## Step 6: Test Everything
1. Create a test channel with small price (₹1)
2. Test the payment flow
3. Verify subscription creation
4. Check admin dashboard analytics

## Support
- Database automatically creates all tables
- Payment system works with both UPI and cards
- Subscription billing runs automatically
- Admin can withdraw earnings anytime

Your website is now ready for customers!