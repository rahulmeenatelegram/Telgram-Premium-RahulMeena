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
    const { withdrawals: withdrawalsTable, insertWithdrawalSchema } = await import('../../shared/schema.js');
    const { desc } = await import('drizzle-orm');
    const { ZodError } = await import('zod');

    if (req.method === 'GET') {
      console.log('📡 Admin: Fetching withdrawals');
      
      // Fetch all withdrawals ordered by creation date (newest first)
      const withdrawals = await db.select().from(withdrawalsTable).orderBy(desc(withdrawalsTable.createdAt));
      
      console.log(`✅ Admin: Retrieved ${withdrawals.length} withdrawals`);
      return res.status(200).json(withdrawals);
    }

    if (req.method === 'POST') {
      console.log('📡 Admin: Creating withdrawal request');
      
      const withdrawalData = insertWithdrawalSchema.parse(req.body);
      const inserted = await db.insert(withdrawalsTable).values(withdrawalData).returning();
      const newWithdrawal = Array.isArray(inserted) ? inserted[0] : inserted;
      
      console.log('✅ Admin: Withdrawal request created', newWithdrawal);
      return res.status(201).json(newWithdrawal);
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    if (error instanceof ZodError) {
      console.error('❌ Admin Validation error:', error.errors);
      return res.status(400).json({ message: 'Invalid withdrawal data', errors: error.errors });
    }
    console.error('❌ Admin: Error with withdrawals', error);
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}
