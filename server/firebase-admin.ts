import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK
let app;
if (getApps().length === 0) {
  // For development without service account, use minimal config
  app = initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "telegram-premium-8d722",
    databaseURL: `https://${process.env.VITE_FIREBASE_PROJECT_ID || "telegram-premium-8d722"}-default-rtdb.firebaseio.com/`,
  });
} else {
  app = getApps()[0];
}

export const adminDb = getDatabase(app);
export const adminAuth = getAuth(app);

// Firebase service functions for server-side operations
export class FirebaseAdminService {
  static async updateWalletBalance(amount: number, type: "credit" | "debit", description: string, reference?: string) {
    const walletRef = adminDb.ref("adminWallet/main");
    
    // Get current wallet data
    const walletSnapshot = await walletRef.once('value');
    let walletData = walletSnapshot.val() || {
      id: "main",
      balance: 0,
      totalEarnings: 0,
      totalWithdrawn: 0,
      updatedAt: Date.now(),
    };
    
    let currentBalance = walletData.balance || 0;
    let totalEarnings = walletData.totalEarnings || 0;
    let totalWithdrawn = walletData.totalWithdrawn || 0;
    
    const newBalance = type === "credit" ? currentBalance + amount : currentBalance - amount;
    const newTotalEarnings = type === "credit" ? totalEarnings + amount : totalEarnings;
    const newTotalWithdrawn = type === "debit" ? totalWithdrawn + amount : totalWithdrawn;
    
    // Update wallet
    const updatedWallet = {
      id: "main",
      balance: newBalance,
      totalEarnings: newTotalEarnings,
      totalWithdrawn: newTotalWithdrawn,
      updatedAt: Date.now(),
    };
    await walletRef.set(updatedWallet);
    
    // Create transaction record
    const transactionRef = adminDb.ref("adminWalletTransactions").push();
    const transaction = {
      id: transactionRef.key,
      type,
      amount,
      description,
      reference,
      balanceAfter: newBalance,
      createdAt: Date.now(),
    };
    await transactionRef.set(transaction);
    
    return updatedWallet;
  }

  static async getWalletBalance(): Promise<number> {
    const walletRef = adminDb.ref("adminWallet/main");
    const walletSnapshot = await walletRef.once('value');
    const walletData = walletSnapshot.val();
    return walletData ? walletData.balance || 0 : 0;
  }

  static async verifyAdminUser(uid: string): Promise<boolean> {
    try {
      const userRecord = await adminAuth.getUser(uid);
      return userRecord.email === 'disruptivefounder@gmail.com';
    } catch (error) {
      return false;
    }
  }

  static async createInstantWithdrawal(
    amount: number,
    withdrawalMethod: string,
    accountDetails: any,
    adminEmail: string
  ): Promise<{ success: boolean; payoutId?: string; error?: string }> {
    try {
      // Check current balance
      const currentBalance = await this.getWalletBalance();
      if (currentBalance < amount) {
        return { success: false, error: "Insufficient balance" };
      }

      // For demo purposes, simulate successful withdrawal
      // In production, integrate with actual Razorpay Payouts API
      const mockPayoutId = `payout_${Date.now()}`;

      // Debit from wallet
      await this.updateWalletBalance(
        amount,
        "debit",
        `Instant withdrawal via ${withdrawalMethod}`,
        mockPayoutId
      );

      // Create withdrawal record
      const withdrawalRef = adminDb.ref("adminWithdrawals").push();
      const withdrawalData = {
        id: withdrawalRef.key,
        amount,
        withdrawalMethod,
        accountDetails,
        status: "completed",
        razorpayPayoutId: mockPayoutId,
        requestedAt: Date.now(),
        completedAt: Date.now(),
      };
      await withdrawalRef.set(withdrawalData);

      return { success: true, payoutId: mockPayoutId };
    } catch (error) {
      console.error("Error creating instant withdrawal:", error);
      return { success: false, error: "Withdrawal processing failed" };
    }
  }
}