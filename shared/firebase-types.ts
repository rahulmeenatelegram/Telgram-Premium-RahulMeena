import { z } from "zod";

// Firebase document types
export interface User {
  uid: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  subscriptionType: "monthly" | "yearly";
  telegramLink: string;
  memberCount: number;
  icon: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Payment {
  id: string;
  userId?: string;
  channelId: string;
  subscriptionId?: string;
  email: string;
  amount: number;
  paymentType: "one-time" | "subscription";
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  status: "pending" | "success" | "failed";
  paymentMethod: "upi" | "card";
  createdAt: Date;
  completedAt?: Date;
}

export interface Subscription {
  id: string;
  userId?: string;
  channelId: string;
  email: string;
  accessLink: string;
  status: "active" | "paused" | "cancelled" | "expired";
  subscriptionType: "monthly" | "yearly";
  amount: number;
  razorpaySubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextBillingDate: Date;
  createdAt: Date;
  cancelledAt?: Date;
}

export interface AdminWallet {
  id: string;
  balance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  updatedAt: Date;
}

export interface AdminWalletTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  reference?: string;
  balanceAfter: number;
  createdAt: Date;
}

export interface AdminWithdrawal {
  id: string;
  amount: number;
  withdrawalMethod: "bank_account" | "upi" | "wallet";
  accountDetails: {
    accountNumber?: string;
    ifsc?: string;
    accountHolderName?: string;
    upiId?: string;
    walletNumber?: string;
  };
  status: "pending" | "processing" | "completed" | "failed";
  razorpayPayoutId?: string;
  failureReason?: string;
  requestedAt: Date;
  completedAt?: Date;
}

// Validation schemas
export const insertUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "user"]).default("user"),
});

export const insertChannelSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  subscriptionType: z.enum(["monthly", "yearly"]).default("monthly"),
  telegramLink: z.string().url(),
  memberCount: z.number().default(0),
  icon: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const insertPaymentSchema = z.object({
  userId: z.string().optional(),
  channelId: z.string(),
  subscriptionId: z.string().optional(),
  email: z.string().email(),
  amount: z.number().min(0),
  paymentType: z.enum(["one-time", "subscription"]).default("one-time"),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  status: z.enum(["pending", "success", "failed"]).default("pending"),
  paymentMethod: z.enum(["upi", "card"]),
});

export const insertSubscriptionSchema = z.object({
  userId: z.string().optional(),
  channelId: z.string(),
  email: z.string().email(),
  accessLink: z.string().url(),
  status: z.enum(["active", "paused", "cancelled", "expired"]).default("active"),
  subscriptionType: z.enum(["monthly", "yearly"]),
  amount: z.number().min(0),
  razorpaySubscriptionId: z.string().optional(),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  nextBillingDate: z.date(),
});

export const insertAdminWithdrawalSchema = z.object({
  amount: z.number().min(0),
  withdrawalMethod: z.enum(["bank_account", "upi", "wallet"]),
  accountDetails: z.object({
    accountNumber: z.string().optional(),
    ifsc: z.string().optional(),
    accountHolderName: z.string().optional(),
    upiId: z.string().optional(),
    walletNumber: z.string().optional(),
  }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type InsertAdminWithdrawal = z.infer<typeof insertAdminWithdrawalSchema>;