import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

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

  if (req.method === 'GET') {
    try {
      console.log("✅ [1] /api/channels handler invoked.");
      console.log("✅ [2] Executing query to fetch channels...");
      
      const result = await pool.query("SELECT * FROM channels WHERE is_active = true ORDER BY created_at DESC");
      
      console.log("✅ [3] Query successful. Found", result.rows.length, "channels.");
      
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("❌ [ERROR] Failed to fetch channels:", error);
      res.status(500).json({ message: "Failed to fetch channels", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
