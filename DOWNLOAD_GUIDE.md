# Download & Local Development Guide

## Method 1: Download ZIP from Replit

1. **In your Replit project:**
   - Click the three dots menu (⋯) in the top right
   - Select "Download as ZIP"
   - Extract the ZIP file to your local machine

2. **Open in VS Code:**
   - Open VS Code
   - File → Open Folder
   - Select your extracted project folder

## Method 2: Clone from GitHub (Recommended)

1. **Connect Replit to GitHub first:**
   - In Replit, click Version Control (Git icon)
   - Connect to GitHub
   - Create/push to repository

2. **Clone locally:**
   ```bash
   git clone https://github.com/yourusername/onetapay-telegram-platform.git
   cd onetapay-telegram-platform
   ```

## Local Development Setup

### Prerequisites
- Node.js 18+ installed
- Git installed
- VS Code installed

### Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your environment variables to `.env`:**
   ```env
   CUSTOMER_DATABASE_URL=your_neon_database_url
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   SESSION_SECRET=your_random_session_secret
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Go to `http://localhost:5000`

### Database Setup

1. **Push schema to database:**
   ```bash
   npm run db:push
   ```

2. **If you get connection errors:**
   - Check your DATABASE_URL is correct
   - Ensure your Neon database allows external connections

### VS Code Extensions (Recommended)

Install these extensions for better development experience:
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (for API testing)

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes to database

# Type checking
npm run check        # TypeScript type checking
```

### Project Structure
```
onetapay-telegram-platform/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
├── server/           # Express backend
│   ├── routes.ts
│   ├── storage.ts
│   ├── auth.ts
│   └── index.ts
├── shared/           # Shared types/schemas
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**Database connection issues:**
- Verify DATABASE_URL format
- Check Neon dashboard for connection details
- Ensure IP allowlist includes your location

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Run type checking
npm run check
```

### Git Workflow

1. **Make changes in VS Code**
2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin main
   ```

4. **Deploy to Vercel:**
   - Changes will auto-deploy if connected to Vercel

### Benefits of Local Development

- ✅ Full VS Code features and extensions
- ✅ Better performance than web editor
- ✅ Offline development capability
- ✅ Advanced debugging tools
- ✅ Git integration
- ✅ Multiple file editing
- ✅ Search across entire project
- ✅ Integrated terminal

This setup gives you complete control over your development environment!