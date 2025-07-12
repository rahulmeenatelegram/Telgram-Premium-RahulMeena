// Vercel serverless function handler for API endpoints
import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Express } from "express";
import { registerRoutes } from "../server/routes.js";

let app: Express | null = null;

// Initialize the app with routes
async function initializeApp() {
  if (app) return app;
  
  console.log('Initializing Express app...');
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Add CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });
  
  // Register routes asynchronously
  await registerRoutes(app);
  
  console.log('Express app initialized successfully');
  return app;
}

// Vercel handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`API Request: ${req.method} ${req.url}`);
    console.log('Request headers:', req.headers);
    console.log('Request query:', req.query);
    
    const expressApp = await initializeApp();
    
    // Ensure the request URL includes /api prefix for proper routing
    const originalUrl = req.url || '';
    if (!originalUrl.startsWith('/api/')) {
      req.url = '/api' + (originalUrl.startsWith('/') ? originalUrl : '/' + originalUrl);
      console.log('Modified URL to:', req.url);
    }
    
    // Handle the request with Express
    expressApp(req, res);
  } catch (error) {
    console.error('API Handler Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}