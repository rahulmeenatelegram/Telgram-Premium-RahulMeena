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
    const { 
      channels: channelsTable, 
      payments: paymentsTable, 
      subscriptions: subscriptionsTable,
      users: usersTable,
      withdrawals: withdrawalsTable
    } = await import('../../shared/schema.js');
    const { eq, count, sum, and, gte, lt } = await import('drizzle-orm');

    console.log('📡 Admin: Fetching analytics data');

    // Get current date boundaries
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch all basic counts
    const [
      totalUsersResult,
      totalChannelsResult,
      activeChannelsResult,
      totalPaymentsResult,
      successfulPaymentsResult,
      monthlyPaymentsResult,
      weeklyPaymentsResult,
      activeSubscriptionsResult
    ] = await Promise.all([
      db.select({ count: count() }).from(usersTable),
      db.select({ count: count() }).from(channelsTable),
      db.select({ count: count() }).from(channelsTable).where(eq(channelsTable.isActive, true)),
      db.select({ count: count() }).from(paymentsTable),
      db.select({ count: count() }).from(paymentsTable).where(eq(paymentsTable.status, 'success')),
      db.select({ count: count() }).from(paymentsTable).where(
        and(
          eq(paymentsTable.status, 'success'),
          gte(paymentsTable.createdAt, startOfMonth)
        )
      ),
      db.select({ count: count() }).from(paymentsTable).where(
        and(
          eq(paymentsTable.status, 'success'),
          gte(paymentsTable.createdAt, startOfWeek)
        )
      ),
      db.select({ count: count() }).from(subscriptionsTable).where(eq(subscriptionsTable.status, 'active'))
    ]);

    // Fetch revenue data
    const [
      totalRevenueResult,
      monthlyRevenueResult,
      lastMonthRevenueResult,
      weeklyRevenueResult
    ] = await Promise.all([
      db.select({ total: sum(paymentsTable.amount) }).from(paymentsTable).where(eq(paymentsTable.status, 'success')),
      db.select({ total: sum(paymentsTable.amount) }).from(paymentsTable).where(
        and(
          eq(paymentsTable.status, 'success'),
          gte(paymentsTable.createdAt, startOfMonth)
        )
      ),
      db.select({ total: sum(paymentsTable.amount) }).from(paymentsTable).where(
        and(
          eq(paymentsTable.status, 'success'),
          gte(paymentsTable.createdAt, startOfLastMonth),
          lt(paymentsTable.createdAt, startOfMonth)
        )
      ),
      db.select({ total: sum(paymentsTable.amount) }).from(paymentsTable).where(
        and(
          eq(paymentsTable.status, 'success'),
          gte(paymentsTable.createdAt, startOfWeek)
        )
      )
    ]);

    // Calculate derived metrics
    const totalUsers = totalUsersResult[0]?.count || 0;
    const activeChannels = activeChannelsResult[0]?.count || 0;
    const totalPayments = totalPaymentsResult[0]?.count || 0;
    const successfulPayments = successfulPaymentsResult[0]?.count || 0;
    const monthlyPayments = monthlyPaymentsResult[0]?.count || 0;
    const weeklyPayments = weeklyPaymentsResult[0]?.count || 0;
    
    const totalRevenue = parseFloat(totalRevenueResult[0]?.total || '0');
    const monthlyRevenue = parseFloat(monthlyRevenueResult[0]?.total || '0');
    const lastMonthRevenue = parseFloat(lastMonthRevenueResult[0]?.total || '0');
    const weeklyRevenue = parseFloat(weeklyRevenueResult[0]?.total || '0');
    
    const successRate = totalPayments > 0 ? Math.round((successfulPayments / totalPayments) * 100) : 0;
    const averageOrderValue = successfulPayments > 0 ? totalRevenue / successfulPayments : 0;
    const revenueGrowth = lastMonthRevenue > 0 ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;

    // Mock some additional data for now
    const analytics = {
      totalUsers,
      totalRevenue,
      availableBalance: totalRevenue * 0.85, // Assume 15% fees
      totalWithdrawn: totalRevenue * 0.15,
      activeChannels,
      monthlyRevenue,
      totalPayments,
      successfulPayments,
      successRate,
      recentActivity: {
        paymentsThisMonth: monthlyPayments,
        channelsCount: activeChannels,
        averageOrderValue,
        weeklyRevenue,
        weeklyPayments,
        userGrowthThisMonth: Math.floor(totalUsers * 0.1), // Mock 10% growth
        revenueGrowth,
        lastMonthRevenue,
        averageChannelPrice: activeChannels > 0 ? totalRevenue / (activeChannels * 10) : 0 // Mock calculation
      },
      insights: {
        topPerformingDay: {
          date: new Date().toISOString().split('T')[0],
          revenue: weeklyRevenue * 0.3
        },
        conversionRate: 15, // Mock 15% conversion rate
        repeatCustomers: {
          count: Math.floor(totalUsers * 0.2),
          percentage: 20
        },
        averageMonthlyGrowth: 12 // Mock 12% monthly growth
      }
    };

    console.log('✅ Admin: Analytics data compiled');
    return res.status(200).json(analytics);

  } catch (error) {
    console.error('❌ Admin: Error fetching analytics', error);
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}
