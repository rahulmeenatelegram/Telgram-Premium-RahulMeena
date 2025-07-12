// Vercel serverless function handler for API endpoints
import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// Create a single database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log(`API Request: ${req.method} ${req.url}`);

  try {
    const url = req.url || '';
    const path = url.split('?')[0];
    
    console.log(`Processing path: ${path}`);

    // Handle /api/channels route
    if (path === '/api/channels' && req.method === 'GET') {
      console.log("✅ [1] /api/channels handler invoked.");
      
      try {
        const result = await pool.query("SELECT * FROM channels WHERE is_active = true ORDER BY created_at DESC");
        console.log("✅ [2] Query successful. Found", result.rows.length, "channels.");
        
        res.status(200).json(result.rows);
        return;
      } catch (dbError) {
        console.error("❌ Database error:", dbError);
        
        // Return mock data if database fails
        const mockChannels = [
          {
            id: 1,
            name: "Premium Tech Channel",
            slug: "premium-tech",
            description: "Latest tech news and insights",
            icon: "🚀",
            price: 99,
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Crypto Updates",
            slug: "crypto-updates",
            description: "Real-time cryptocurrency updates",
            icon: "₿",
            price: 149,
            is_active: true,
            created_at: new Date().toISOString()
          }
        ];
        
        console.log("✅ [3] Returning mock channels due to DB error:", mockChannels.length);
        res.status(200).json(mockChannels);
        return;
      }
    }

    // Handle test route
    if (path === '/api/test' && req.method === 'GET') {
      res.status(200).json({
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        environment: process.env.NODE_ENV || 'unknown'
      });
      return;
    }

    // Default 404 for unmatched routes
    res.status(404).json({ message: 'Route not found', path });

  } catch (error) {
    console.error('API Handler Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      path: req.url
    });
  }
}