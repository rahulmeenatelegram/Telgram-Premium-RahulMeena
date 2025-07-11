import { users, channels, payments, purchases, withdrawals, subscriptions, adminWallet, adminWalletTransactions, adminWithdrawals, type User, type InsertUser, type Channel, type InsertChannel, type Payment, type InsertPayment, type Purchase, type InsertPurchase, type Withdrawal, type InsertWithdrawal, type Subscription, type InsertSubscription, type AdminWallet, type AdminWalletTransaction, type InsertAdminWalletTransaction, type AdminWithdrawal, type InsertAdminWithdrawal } from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Channel methods
  getAllChannels(): Promise<Channel[]>;
  getActiveChannels(): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  getChannelBySlug(slug: string): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  updateChannel(id: number, updates: Partial<InsertChannel>): Promise<Channel | undefined>;
  deleteChannel(id: number): Promise<boolean>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentByRazorpayOrderId(orderId: string): Promise<Payment | undefined>;
  updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
  getRecentPayments(limit?: number): Promise<Payment[]>;
  
  // Subscription methods
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionByToken(token: string): Promise<Subscription | undefined>;
  getUserSubscriptions(userId: number): Promise<Subscription[]>;
  getEmailSubscriptions(email: string): Promise<Subscription[]>;
  getActiveSubscriptions(): Promise<Subscription[]>;
  updateSubscription(id: number, updates: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  cancelSubscription(id: number): Promise<Subscription | undefined>;
  getExpiringSubscriptions(): Promise<Subscription[]>;
  
  // Purchase methods
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: number): Promise<Purchase[]>;
  getEmailPurchases(email: string): Promise<Purchase[]>;
  getPurchase(id: number): Promise<Purchase | undefined>;
  
  // Withdrawal methods
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getAllWithdrawals(): Promise<Withdrawal[]>;
  updateWithdrawal(id: number, updates: Partial<InsertWithdrawal>): Promise<Withdrawal | undefined>;
  
  // Analytics methods
  getTotalUsers(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getAvailableBalance(): Promise<number>;
  getTotalWithdrawn(): Promise<number>;
  
  // Admin Wallet methods
  getAdminWallet(): Promise<AdminWallet>;
  updateAdminWalletBalance(amount: number, type: 'credit' | 'debit', description: string, reference?: string): Promise<AdminWallet>;
  createAdminWalletTransaction(transaction: InsertAdminWalletTransaction): Promise<AdminWalletTransaction>;
  getAdminWalletTransactions(limit?: number): Promise<AdminWalletTransaction[]>;
  createAdminWithdrawal(withdrawal: InsertAdminWithdrawal): Promise<AdminWithdrawal>;
  getAdminWithdrawals(): Promise<AdminWithdrawal[]>;
  updateAdminWithdrawal(id: number, updates: Partial<InsertAdminWithdrawal>): Promise<AdminWithdrawal | undefined>;
  processRazorpayPayout(withdrawalId: number, amount: number, accountDetails: any): Promise<{ success: boolean; payoutId?: string; error?: string }>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Channel methods
  async getAllChannels(): Promise<Channel[]> {
    return await db.select().from(channels).orderBy(desc(channels.createdAt));
  }

  async getActiveChannels(): Promise<Channel[]> {
    // Use raw SQL to avoid column mapping issues
    const result = await pool.query("SELECT * FROM channels ORDER BY created_at DESC");
    return result.rows;
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    // Use raw SQL to avoid column mapping issues
    const result = await pool.query("SELECT * FROM channels WHERE id = $1", [id]);
    return result.rows[0] || undefined;
  }

  async getChannelBySlug(slug: string): Promise<Channel | undefined> {
    const [channel] = await db.select().from(channels).where(eq(channels.slug, slug));
    return channel || undefined;
  }

  async createChannel(channel: InsertChannel): Promise<Channel> {
    const [newChannel] = await db
      .insert(channels)
      .values(channel)
      .returning();
    return newChannel;
  }

  async updateChannel(id: number, updates: Partial<InsertChannel>): Promise<Channel | undefined> {
    const [updatedChannel] = await db
      .update(channels)
      .set(updates)
      .where(eq(channels.id, id))
      .returning();
    return updatedChannel || undefined;
  }

  async deleteChannel(id: number): Promise<boolean> {
    const result = await db.delete(channels).where(eq(channels.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return newPayment;
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentByRazorpayOrderId(orderId: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.razorpayOrderId, orderId));
    return payment || undefined;
  }

  async updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(payments)
      .set(updates)
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment || undefined;
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getRecentPayments(limit: number = 10): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt)).limit(limit);
  }

  // Purchase methods
  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const [newPurchase] = await db
      .insert(purchases)
      .values(purchase)
      .returning();
    return newPurchase;
  }

  async getUserPurchases(userId: number): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.userId, userId)).orderBy(desc(purchases.createdAt));
  }

  async getEmailPurchases(email: string): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.email, email)).orderBy(desc(purchases.createdAt));
  }

  async getPurchase(id: number): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, id));
    return purchase || undefined;
  }

  // Withdrawal methods
  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const [newWithdrawal] = await db
      .insert(withdrawals)
      .values(withdrawal)
      .returning();
    return newWithdrawal;
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    return await db.select().from(withdrawals).orderBy(desc(withdrawals.createdAt));
  }

  async updateWithdrawal(id: number, updates: Partial<InsertWithdrawal>): Promise<Withdrawal | undefined> {
    const [updatedWithdrawal] = await db
      .update(withdrawals)
      .set(updates)
      .where(eq(withdrawals.id, id))
      .returning();
    return updatedWithdrawal || undefined;
  }

  // Subscription methods
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    console.log('Creating subscription with data:', subscription);
    
    // Check for null required fields and set defaults
    const currentPeriodStart = subscription.currentPeriodStart || new Date();
    const currentPeriodEnd = subscription.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const nextBillingDate = subscription.nextBillingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // First check if telegram_username column exists and add it if needed
    const columnCheck = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'telegram_username'");
    console.log('Column check result:', columnCheck.rows);
    
    if (columnCheck.rows.length === 0) {
      console.log('Adding telegram_username column to subscriptions table...');
      await pool.query("ALTER TABLE subscriptions ADD COLUMN telegram_username text");
      console.log('Column added successfully');
    }

    // Also make access_link optional since we're not using token-based access
    try {
      await pool.query("ALTER TABLE subscriptions ALTER COLUMN access_link DROP NOT NULL");
      console.log('Made access_link column optional');
    } catch (error) {
      console.log('access_link column might already be optional or not exist');
    }
    
    // Simplified query with access_link set to a default value
    const query = `
      INSERT INTO subscriptions (
        channel_id, email, telegram_username, access_link,
        status, subscription_type, amount, 
        current_period_start, current_period_end, next_billing_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    `;
    
    const accessLink = `https://t.me/+${Math.random().toString(36).substring(2, 15)}`;
    
    const values = [
      subscription.channelId,
      subscription.email, 
      subscription.telegramUsername,
      accessLink,
      subscription.status,
      subscription.subscriptionType,
      subscription.amount,
      currentPeriodStart,
      currentPeriodEnd,
      nextBillingDate
    ];
    
    console.log('Executing query with values:', values);
    const result = await pool.query(query, values);
    console.log('Query result:', result.rows[0]);
    return result.rows[0] as any;
  }

  async getSubscription(id: number): Promise<Subscription | undefined> {
    // Use raw SQL to avoid column mapping issues
    const result = await pool.query("SELECT * FROM subscriptions WHERE id = $1", [id]);
    return result.rows[0] || undefined;
  }

  async getSubscriptionByToken(token: string): Promise<Subscription | undefined> {
    // Token-based access no longer used, return undefined
    return undefined;
  }

  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    // Only return active subscriptions that are not expired (within 30 days)
    const result = await db.execute(sql`
      SELECT s.*, c.name as channel_name, c.telegram_invite_link 
      FROM subscriptions s 
      JOIN channels c ON s.channel_id = c.id 
      WHERE s.user_id = ${userId} 
      AND s.status = 'active' 
      AND s.current_period_end > NOW() 
      ORDER BY s.created_at DESC
    `);
    return result.rows as any[];
  }

  async getEmailSubscriptions(email: string): Promise<Subscription[]> {
    // Only return active subscriptions that are not expired (within 30 days)
    const result = await db.execute(sql`
      SELECT s.*, c.name as channel_name, c.telegram_invite_link 
      FROM subscriptions s 
      JOIN channels c ON s.channel_id = c.id 
      WHERE s.email = ${email} 
      AND s.status = 'active' 
      AND s.current_period_end > NOW() 
      ORDER BY s.created_at DESC
    `);
    return result.rows as any[];
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    // Use raw SQL to avoid column mapping issues temporarily
    const result = await db.execute(sql`SELECT * FROM subscriptions WHERE status = 'active' ORDER BY created_at DESC`);
    return result.rows as any[];
  }

  async updateSubscription(id: number, updates: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const [updatedSubscription] = await db
      .update(subscriptions)
      .set(updates)
      .where(eq(subscriptions.id, id))
      .returning();
    return updatedSubscription || undefined;
  }

  async cancelSubscription(id: number): Promise<Subscription | undefined> {
    const [cancelledSubscription] = await db
      .update(subscriptions)
      .set({ 
        status: 'cancelled',
        cancelledAt: new Date()
      })
      .where(eq(subscriptions.id, id))
      .returning();
    return cancelledSubscription || undefined;
  }

  async getExpiringSubscriptions(): Promise<Subscription[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, 'active'),
          sql`${subscriptions.nextBillingDate} <= ${tomorrow}`
        )
      )
      .orderBy(subscriptions.nextBillingDate);
  }

  // Analytics methods
  async getTotalUsers(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    return Number(result.count) || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const [result] = await db
      .select({ total: sql<string>`coalesce(sum(${payments.amount}), 0)::decimal` })
      .from(payments)
      .where(eq(payments.status, 'success'));
    return parseFloat(result.total) || 0;
  }

  async getAvailableBalance(): Promise<number> {
    const totalRevenue = await this.getTotalRevenue();
    const totalWithdrawn = await this.getTotalWithdrawn();
    return totalRevenue - totalWithdrawn;
  }

  async getTotalWithdrawn(): Promise<number> {
    const [result] = await db
      .select({ total: sql<string>`coalesce(sum(${withdrawals.amount}), 0)::decimal` })
      .from(withdrawals)
      .where(eq(withdrawals.status, 'completed'));
    return parseFloat(result.total) || 0;
  }

  // Admin Wallet methods
  async getAdminWallet(): Promise<AdminWallet> {
    const [wallet] = await db.select().from(adminWallet).limit(1);
    if (!wallet) {
      // Initialize wallet if doesn't exist
      const [newWallet] = await db.insert(adminWallet).values({
        balance: "0.00",
        totalEarnings: "0.00",
        totalWithdrawn: "0.00"
      }).returning();
      return newWallet;
    }
    return wallet;
  }

  async updateAdminWalletBalance(amount: number, type: 'credit' | 'debit', description: string, reference?: string): Promise<AdminWallet> {
    const wallet = await this.getAdminWallet();
    const currentBalance = parseFloat(wallet.balance);
    const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount;
    
    if (newBalance < 0) {
      throw new Error('Insufficient wallet balance');
    }

    const updates: any = {
      balance: newBalance.toFixed(2),
      updatedAt: new Date()
    };

    if (type === 'credit') {
      const totalEarnings = parseFloat(wallet.totalEarnings) + amount;
      updates.totalEarnings = totalEarnings.toFixed(2);
    } else {
      const totalWithdrawn = parseFloat(wallet.totalWithdrawn) + amount;
      updates.totalWithdrawn = totalWithdrawn.toFixed(2);
    }

    const [updatedWallet] = await db.update(adminWallet)
      .set(updates)
      .where(eq(adminWallet.id, wallet.id))
      .returning();

    // Create transaction record
    await this.createAdminWalletTransaction({
      type,
      amount: amount.toFixed(2),
      description,
      reference,
      balanceAfter: newBalance.toFixed(2)
    });

    return updatedWallet;
  }

  async createAdminWalletTransaction(transaction: InsertAdminWalletTransaction): Promise<AdminWalletTransaction> {
    const [newTransaction] = await db.insert(adminWalletTransactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getAdminWalletTransactions(limit: number = 50): Promise<AdminWalletTransaction[]> {
    try {
      const transactions = await db.select()
        .from(adminWalletTransactions)
        .orderBy(desc(adminWalletTransactions.createdAt))
        .limit(limit);
      return transactions;
    } catch (error) {
      console.error('Error fetching admin wallet transactions:', error);
      return []; // Return empty array instead of throwing to prevent loops
    }
  }

  async createAdminWithdrawal(withdrawal: InsertAdminWithdrawal): Promise<AdminWithdrawal> {
    const [newWithdrawal] = await db.insert(adminWithdrawals)
      .values(withdrawal)
      .returning();
    return newWithdrawal;
  }

  async getAdminWithdrawals(): Promise<AdminWithdrawal[]> {
    return await db.select()
      .from(adminWithdrawals)
      .orderBy(desc(adminWithdrawals.requestedAt));
  }

  async updateAdminWithdrawal(id: number, updates: Partial<InsertAdminWithdrawal>): Promise<AdminWithdrawal | undefined> {
    const [updatedWithdrawal] = await db.update(adminWithdrawals)
      .set(updates)
      .where(eq(adminWithdrawals.id, id))
      .returning();
    return updatedWithdrawal || undefined;
  }

  async processRazorpayPayout(withdrawalId: number, amount: number, accountDetails: any): Promise<{ success: boolean; payoutId?: string; error?: string }> {
    try {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      const payoutData: any = {
        account_number: '2323230086066488', // Use your Razorpay account number
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        mode: accountDetails.type === 'upi' ? 'UPI' : 'IMPS',
        purpose: 'payout',
        fund_account: {
          account_type: accountDetails.type === 'bank_account' ? 'bank_account' : 'vpa',
          ...(accountDetails.type === 'bank_account' ? {
            bank_account: {
              name: accountDetails.name,
              ifsc: accountDetails.ifsc,
              account_number: accountDetails.accountNumber
            }
          } : {
            vpa: {
              address: accountDetails.upiId
            }
          }),
          contact: {
            name: accountDetails.name,
            email: accountDetails.email || 'admin@telechannels.com',
            contact: accountDetails.mobile || '9999999999',
            type: 'self'
          }
        },
        queue_if_low_balance: true,
        reference_id: `withdrawal_${withdrawalId}`,
        narration: 'TeleChannels Admin Withdrawal'
      };

      const payout = await razorpay.payouts.create(payoutData);
      
      await this.updateAdminWithdrawal(withdrawalId, {
        status: 'processing'
      });

      return { success: true, payoutId: payout.id };
    } catch (error: any) {
      await this.updateAdminWithdrawal(withdrawalId, {
        status: 'failed'
      });
      
      return { success: false, error: error.message || 'Payout failed' };
    }
  }
}

export const storage = new DatabaseStorage();
