import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../server/db';
import { channels as channelsTable } from '../shared/schema';
import { eq } from 'drizzle-orm';

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
      console.log('📡 Fetching channels from database');
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
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
