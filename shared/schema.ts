import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  subscriptionType: text("subscription_type").notNull().default("monthly"), // monthly, yearly
  telegramLink: text("telegram_link").notNull(),
  memberCount: integer("member_count").default(0),
  icon: text("icon").notNull(), // Font Awesome icon class
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  channelId: integer("channel_id").notNull(),
  subscriptionId: integer("subscription_id"), // Link to subscription for recurring payments
  email: text("email").notNull(), // For guest purchases
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentType: text("payment_type").notNull().default("one-time"), // one-time, subscription
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  status: text("status").notNull().default("pending"), // pending, success, failed
  paymentMethod: text("payment_method"), // upi, card
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Subscriptions table for recurring billing
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  channelId: integer("channel_id").notNull(),
  email: text("email").notNull(),
  accessLink: text("access_link").notNull(),
  status: text("status").notNull().default("active"), // active, paused, cancelled, expired
  subscriptionType: text("subscription_type").notNull(), // monthly, yearly
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  razorpaySubscriptionId: text("razorpay_subscription_id"),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  nextBillingDate: timestamp("next_billing_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  cancelledAt: timestamp("cancelled_at"),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  channelId: integer("channel_id").notNull(),
  paymentId: integer("payment_id").notNull(),
  email: text("email").notNull(),
  accessLink: text("access_link").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // For time-limited access
});

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  requestedBy: integer("requested_by").notNull(),
  bankDetails: jsonb("bank_details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const adminWallet = pgTable("admin_wallet", {
  id: serial("id").primaryKey(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalWithdrawn: decimal("total_withdrawn", { precision: 10, scale: 2 }).default("0.00").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adminWalletTransactions = pgTable("admin_wallet_transactions", {
  id: serial("id").primaryKey(),
  type: text("type", { enum: ["credit", "debit"] }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  reference: text("reference"), // payment_id, subscription_id, withdrawal_id
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminWithdrawals = pgTable("admin_withdrawals", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  withdrawalMethod: text("withdrawal_method", { enum: ["bank_account", "upi", "wallet"] }).notNull(),
  accountDetails: jsonb("account_details").notNull(), // bank details, UPI ID, etc.
  status: text("status", { enum: ["pending", "processing", "completed", "failed"] }).default("pending").notNull(),
  razorpayPayoutId: text("razorpay_payout_id"),
  failureReason: text("failure_reason"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  payments: many(payments),
  purchases: many(purchases),
  subscriptions: many(subscriptions),
}));

export const channelsRelations = relations(channels, ({ many }) => ({
  payments: many(payments),
  purchases: many(purchases),
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  channel: one(channels, { fields: [subscriptions.channelId], references: [channels.id] }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  channel: one(channels, { fields: [payments.channelId], references: [channels.id] }),
  subscription: one(subscriptions, { fields: [payments.subscriptionId], references: [subscriptions.id] }),
  purchases: many(purchases),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, { fields: [purchases.userId], references: [users.id] }),
  channel: one(channels, { fields: [purchases.channelId], references: [channels.id] }),
  payment: one(payments, { fields: [purchases.paymentId], references: [payments.id] }),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  requestedByUser: one(users, { fields: [withdrawals.requestedBy], references: [users.id] }),
}));

export const adminWalletRelations = relations(adminWallet, ({ many }) => ({
  transactions: many(adminWalletTransactions),
  withdrawals: many(adminWithdrawals),
}));

export const adminWalletTransactionsRelations = relations(adminWalletTransactions, ({ one }) => ({
  wallet: one(adminWallet),
}));

export const adminWithdrawalsRelations = relations(adminWithdrawals, ({ one }) => ({
  wallet: one(adminWallet),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  cancelledAt: true,
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
