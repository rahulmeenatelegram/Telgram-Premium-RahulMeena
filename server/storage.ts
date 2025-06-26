import { users, channels, payments, purchases, withdrawals, type User, type InsertUser, type Channel, type InsertChannel, type Payment, type InsertPayment, type Purchase, type InsertPurchase, type Withdrawal, type InsertWithdrawal } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

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
  getRecentPayments(limit?: number): Promise<Payment[]>;
  
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
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
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
    return await db.select().from(channels).where(eq(channels.isActive, true)).orderBy(desc(channels.createdAt));
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    const [channel] = await db.select().from(channels).where(eq(channels.id, id));
    return channel || undefined;
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

  // Analytics methods
  async getTotalUsers(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result.count;
  }

  async getTotalRevenue(): Promise<number> {
    const [result] = await db
      .select({ total: sql<number>`sum(${payments.amount})` })
      .from(payments)
      .where(eq(payments.status, 'success'));
    return result.total || 0;
  }

  async getAvailableBalance(): Promise<number> {
    const totalRevenue = await this.getTotalRevenue();
    const totalWithdrawn = await this.getTotalWithdrawn();
    return totalRevenue - totalWithdrawn;
  }

  async getTotalWithdrawn(): Promise<number> {
    const [result] = await db
      .select({ total: sql<number>`sum(${withdrawals.amount})` })
      .from(withdrawals)
      .where(eq(withdrawals.status, 'completed'));
    return result.total || 0;
  }
}

export const storage = new DatabaseStorage();
