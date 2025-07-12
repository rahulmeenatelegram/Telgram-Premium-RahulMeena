// Vercel serverless function handler for API endpoints
import 'dotenv/config';
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
  
  // Register routes asynchronously - this returns a Server but we just need the app
  await registerRoutes(app);
  
  console.log('Express app initialized successfully');
  return app;
}

// Vercel handler
export default async function handler(req: any, res: any) {
  try {
    console.log(`API Request: ${req.method} ${req.url}`);
    
    const expressApp = await initializeApp();
    
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