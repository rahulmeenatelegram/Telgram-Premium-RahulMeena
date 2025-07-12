import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ensure DB URL
  if (!process.env.CUSTOMER_DATABASE_URL) {
    console.error('❌ Missing CUSTOMER_DATABASE_URL env var');
    return res
      .status(500)
      .json({ message: 'Server misconfiguration: CUSTOMER_DATABASE_URL not set' });
  }

  try {
    const { db } = await import('../../server/db.js');
    const { channels: channelsTable, insertChannelSchema } = await import('../../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    const { ZodError } = await import('zod');

    if (req.method === 'GET') {
      console.log('📡 Admin: Fetching all channels');
      const allChannels = await db.select().from(channelsTable);
      return res.status(200).json(allChannels);
    }

    if (req.method === 'POST') {
      console.log('📡 Admin: Adding new channel');
      const channelData = insertChannelSchema.parse(req.body);
      const inserted = await db.insert(channelsTable).values(channelData).returning();
      const newChannel = Array.isArray(inserted) ? inserted[0] : inserted;
      console.log('✅ Admin: Channel created', newChannel);
      return res.status(201).json(newChannel);
    }

    // Method not allowed
    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('❌ Admin Validation error:', error.errors);
      return res.status(400).json({ message: 'Invalid channel data', errors: error.errors });
    }
    console.error('❌ Admin: Error in channels handler', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) });
  }
}
