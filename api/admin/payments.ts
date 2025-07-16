import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
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
    const { payments: paymentsTable } = await import('../../shared/schema.js');
    const { desc } = await import('drizzle-orm');

    console.log('📡 Admin: Fetching payments');
    
    // Fetch all payments ordered by creation date (newest first)
    const payments = await db.select().from(paymentsTable).orderBy(desc(paymentsTable.createdAt));
    
    console.log(`✅ Admin: Retrieved ${payments.length} payments`);
    return res.status(200).json(payments);

  } catch (error) {
    console.error('❌ Admin: Error fetching payments', error);
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}
