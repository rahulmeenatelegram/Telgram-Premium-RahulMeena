import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK
let app;
if (getApps().length === 0) {
  // For development, use default credentials
  app = initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);

// Firebase service functions for server-side operations
export class FirebaseAdminService {
  static async updateWalletBalance(amount: number, type: "credit" | "debit", description: string, reference?: string) {
    const walletRef = adminDb.collection("adminWallet").doc("main");
    
    return await adminDb.runTransaction(async (transaction) => {
      const walletDoc = await transaction.get(walletRef);
      
      let currentBalance = 0;
      let totalEarnings = 0;
      let totalWithdrawn = 0;
      
      if (walletDoc.exists) {
        const data = walletDoc.data()!;
        currentBalance = data.balance || 0;
        totalEarnings = data.totalEarnings || 0;
        totalWithdrawn = data.totalWithdrawn || 0;
      }
      
      const newBalance = type === "credit" ? currentBalance + amount : currentBalance - amount;
      const newTotalEarnings = type === "credit" ? totalEarnings + amount : totalEarnings;
      const newTotalWithdrawn = type === "debit" ? totalWithdrawn + amount : totalWithdrawn;
      
      // Update wallet
      transaction.set(walletRef, {
        balance: newBalance,
        totalEarnings: newTotalEarnings,
        totalWithdrawn: newTotalWithdrawn,
        updatedAt: new Date(),
      });
      
      // Create transaction record
      const transactionRef = adminDb.collection("adminWalletTransactions").doc();
      transaction.set(transactionRef, {
        type,
        amount,
        description,
        reference,
        balanceAfter: newBalance,
        createdAt: new Date(),
      });
      
      return {
        balance: newBalance,
        totalEarnings: newTotalEarnings,
        totalWithdrawn: newTotalWithdrawn,
      };
    });
  }

  static async getWalletBalance(): Promise<number> {
    const walletDoc = await adminDb.collection("adminWallet").doc("main").get();
    
    if (!walletDoc.exists) {
      return 0;
    }
    
    const data = walletDoc.data()!;
    return data.balance || 0;
  }

  static async verifyAdminUser(uid: string): Promise<boolean> {
    try {
      const userDoc = await adminDb.collection("users").doc(uid).get();
      
      if (!userDoc.exists) {
        return false;
      }
      
      const userData = userDoc.data()!;
      return userData.role === "admin";
    } catch (error) {
      console.error("Error verifying admin user:", error);
      return false;
    }
  }

  static async createInstantWithdrawal(
    amount: number,
    withdrawalMethod: string,
    accountDetails: any,
    payoutId: string,
    utr?: string
  ) {
    const withdrawalRef = adminDb.collection("instantWithdrawals").doc();
    
    await withdrawalRef.set({
      amount,
      withdrawalMethod,
      accountDetails,
      payoutId,
      utr,
      status: "processed",
      requestedAt: new Date(),
      completedAt: new Date(),
    });
    
    return withdrawalRef.id;
  }
}