import type { VercelRequest, VercelResponse } from '@vercel/node';
// Database and schema will be dynamically imported inside handler

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
    // Check database URL env var
    if (!process.env.CUSTOMER_DATABASE_URL) {
      console.error('❌ Missing CUSTOMER_DATABASE_URL env var');
      return res.status(500).json({ message: 'Server misconfiguration: CUSTOMER_DATABASE_URL not set' });
    }
    try {
      console.log('📡 Fetching channels from database');
      // Import modules dynamically (use .js extension for runtime)
      const { db } = await import('../server/db.js');
      const { channels: channelsTable } = await import('../shared/schema.js');
      const { eq } = await import('drizzle-orm');
      // Query active channels
      const channelRows = await db.select().from(channelsTable).where(
        eq(channelsTable.isActive, true)
      );
      console.log(`📦 Retrieved ${channelRows.length} channels`);
      return res.status(200).json(channelRows);
    } catch (error) {
      console.error('❌ Error fetching channels:', error);
      return res.status(500).json({
        message: 'Failed to fetch channels',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  // Method not allowed
  res.status(405).json({ message: 'Method not allowed' });
}
