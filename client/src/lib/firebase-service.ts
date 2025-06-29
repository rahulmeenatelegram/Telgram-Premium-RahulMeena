import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp,
  runTransaction
} from "firebase/firestore";
import { db } from "./firebase";
import type { 
  User, 
  Channel, 
  Payment, 
  Subscription, 
  AdminWallet, 
  AdminWalletTransaction, 
  AdminWithdrawal,
  InsertChannel,
  InsertPayment,
  InsertSubscription,
  InsertAdminWithdrawal
} from "@shared/firebase-types";

// Collections
const USERS_COLLECTION = "users";
const CHANNELS_COLLECTION = "channels";
const PAYMENTS_COLLECTION = "payments";
const SUBSCRIPTIONS_COLLECTION = "subscriptions";
const ADMIN_WALLET_COLLECTION = "adminWallet";
const ADMIN_WALLET_TRANSACTIONS_COLLECTION = "adminWalletTransactions";
const ADMIN_WITHDRAWALS_COLLECTION = "adminWithdrawals";

// Helper function to convert Firestore timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// User operations
export const createUser = async (userData: { uid: string; email: string; role?: "admin" | "user" }): Promise<User> => {
  const userDoc = {
    uid: userData.uid,
    email: userData.email,
    role: userData.role || "user" as const,
    createdAt: serverTimestamp(),
  };
  
  await setDoc(doc(db, USERS_COLLECTION, userData.uid), userDoc);
  return {
    ...userDoc,
    createdAt: new Date(),
  };
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    uid: data.uid,
    email: data.email,
    role: data.role,
    createdAt: timestampToDate(data.createdAt),
  };
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return {
    uid: data.uid,
    email: data.email,
    role: data.role,
    createdAt: timestampToDate(data.createdAt),
  };
};

// Channel operations
export const getAllChannels = async (): Promise<Channel[]> => {
  const querySnapshot = await getDocs(collection(db, CHANNELS_COLLECTION));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      subscriptionType: data.subscriptionType,
      telegramLink: data.telegramLink,
      memberCount: data.memberCount,
      icon: data.icon,
      isActive: data.isActive,
      createdAt: timestampToDate(data.createdAt),
    };
  });
};

export const getActiveChannels = async (): Promise<Channel[]> => {
  const q = query(
    collection(db, CHANNELS_COLLECTION), 
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      subscriptionType: data.subscriptionType,
      telegramLink: data.telegramLink,
      memberCount: data.memberCount,
      icon: data.icon,
      isActive: data.isActive,
      createdAt: timestampToDate(data.createdAt),
    };
  });
};

export const createChannel = async (channelData: InsertChannel): Promise<Channel> => {
  const docData = {
    ...channelData,
    createdAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, CHANNELS_COLLECTION), docData);
  return {
    id: docRef.id,
    ...channelData,
    createdAt: new Date(),
  };
};

export const updateChannel = async (id: string, updates: Partial<InsertChannel>): Promise<void> => {
  await updateDoc(doc(db, CHANNELS_COLLECTION, id), updates);
};

export const deleteChannel = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, CHANNELS_COLLECTION, id));
};

// Payment operations
export const createPayment = async (paymentData: InsertPayment): Promise<Payment> => {
  const docData = {
    ...paymentData,
    createdAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, PAYMENTS_COLLECTION), docData);
  return {
    id: docRef.id,
    ...paymentData,
    createdAt: new Date(),
  };
};

export const updatePayment = async (id: string, updates: Partial<Payment>): Promise<void> => {
  const updateData = { ...updates };
  if (updateData.completedAt) {
    updateData.completedAt = serverTimestamp();
  }
  await updateDoc(doc(db, PAYMENTS_COLLECTION, id), updateData);
};

export const getPaymentByRazorpayOrderId = async (orderId: string): Promise<Payment | null> => {
  const q = query(collection(db, PAYMENTS_COLLECTION), where("razorpayOrderId", "==", orderId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    channelId: data.channelId,
    subscriptionId: data.subscriptionId,
    email: data.email,
    amount: data.amount,
    paymentType: data.paymentType,
    razorpayOrderId: data.razorpayOrderId,
    razorpayPaymentId: data.razorpayPaymentId,
    razorpaySignature: data.razorpaySignature,
    status: data.status,
    paymentMethod: data.paymentMethod,
    createdAt: timestampToDate(data.createdAt),
    completedAt: data.completedAt ? timestampToDate(data.completedAt) : undefined,
  };
};

// Subscription operations
export const createSubscription = async (subscriptionData: InsertSubscription): Promise<Subscription> => {
  const docData = {
    ...subscriptionData,
    currentPeriodStart: subscriptionData.currentPeriodStart,
    currentPeriodEnd: subscriptionData.currentPeriodEnd,
    nextBillingDate: subscriptionData.nextBillingDate,
    createdAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, SUBSCRIPTIONS_COLLECTION), docData);
  return {
    id: docRef.id,
    ...subscriptionData,
    createdAt: new Date(),
  };
};

export const getUserSubscriptions = async (userId: string): Promise<Subscription[]> => {
  const q = query(
    collection(db, SUBSCRIPTIONS_COLLECTION), 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      channelId: data.channelId,
      email: data.email,
      accessLink: data.accessLink,
      status: data.status,
      subscriptionType: data.subscriptionType,
      amount: data.amount,
      razorpaySubscriptionId: data.razorpaySubscriptionId,
      currentPeriodStart: timestampToDate(data.currentPeriodStart),
      currentPeriodEnd: timestampToDate(data.currentPeriodEnd),
      nextBillingDate: timestampToDate(data.nextBillingDate),
      createdAt: timestampToDate(data.createdAt),
      cancelledAt: data.cancelledAt ? timestampToDate(data.cancelledAt) : undefined,
    };
  });
};

export const getEmailSubscriptions = async (email: string): Promise<Subscription[]> => {
  const q = query(
    collection(db, SUBSCRIPTIONS_COLLECTION), 
    where("email", "==", email),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      channelId: data.channelId,
      email: data.email,
      accessLink: data.accessLink,
      status: data.status,
      subscriptionType: data.subscriptionType,
      amount: data.amount,
      razorpaySubscriptionId: data.razorpaySubscriptionId,
      currentPeriodStart: timestampToDate(data.currentPeriodStart),
      currentPeriodEnd: timestampToDate(data.currentPeriodEnd),
      nextBillingDate: timestampToDate(data.nextBillingDate),
      createdAt: timestampToDate(data.createdAt),
      cancelledAt: data.cancelledAt ? timestampToDate(data.cancelledAt) : undefined,
    };
  });
};

// Admin Wallet operations
export const getAdminWallet = async (): Promise<AdminWallet> => {
  const walletDoc = await getDoc(doc(db, ADMIN_WALLET_COLLECTION, "main"));
  
  if (!walletDoc.exists()) {
    // Create default wallet if it doesn't exist
    const defaultWallet = {
      balance: 0,
      totalEarnings: 0,
      totalWithdrawn: 0,
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, ADMIN_WALLET_COLLECTION, "main"), defaultWallet);
    return {
      id: "main",
      balance: 0,
      totalEarnings: 0,
      totalWithdrawn: 0,
      updatedAt: new Date(),
    };
  }
  
  const data = walletDoc.data();
  return {
    id: "main",
    balance: data.balance,
    totalEarnings: data.totalEarnings,
    totalWithdrawn: data.totalWithdrawn,
    updatedAt: timestampToDate(data.updatedAt),
  };
};

export const updateAdminWalletBalance = async (
  amount: number, 
  type: "credit" | "debit", 
  description: string, 
  reference?: string
): Promise<AdminWallet> => {
  return await runTransaction(db, async (transaction) => {
    const walletRef = doc(db, ADMIN_WALLET_COLLECTION, "main");
    const walletDoc = await transaction.get(walletRef);
    
    let currentBalance = 0;
    let totalEarnings = 0;
    let totalWithdrawn = 0;
    
    if (walletDoc.exists()) {
      const data = walletDoc.data();
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
      updatedAt: serverTimestamp(),
    });
    
    // Create transaction record
    const transactionRef = doc(collection(db, ADMIN_WALLET_TRANSACTIONS_COLLECTION));
    transaction.set(transactionRef, {
      type,
      amount,
      description,
      reference,
      balanceAfter: newBalance,
      createdAt: serverTimestamp(),
    });
    
    return {
      id: "main",
      balance: newBalance,
      totalEarnings: newTotalEarnings,
      totalWithdrawn: newTotalWithdrawn,
      updatedAt: new Date(),
    };
  });
};

export const getAdminWalletTransactions = async (limitCount: number = 50): Promise<AdminWalletTransaction[]> => {
  const q = query(
    collection(db, ADMIN_WALLET_TRANSACTIONS_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type,
      amount: data.amount,
      description: data.description,
      reference: data.reference,
      balanceAfter: data.balanceAfter,
      createdAt: timestampToDate(data.createdAt),
    };
  });
};

// Admin Withdrawal operations
export const createAdminWithdrawal = async (withdrawalData: InsertAdminWithdrawal): Promise<AdminWithdrawal> => {
  const docData = {
    ...withdrawalData,
    status: "pending" as const,
    requestedAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, ADMIN_WITHDRAWALS_COLLECTION), docData);
  return {
    id: docRef.id,
    ...withdrawalData,
    status: "pending",
    requestedAt: new Date(),
  };
};

export const getAdminWithdrawals = async (): Promise<AdminWithdrawal[]> => {
  const q = query(
    collection(db, ADMIN_WITHDRAWALS_COLLECTION),
    orderBy("requestedAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      amount: data.amount,
      withdrawalMethod: data.withdrawalMethod,
      accountDetails: data.accountDetails,
      status: data.status,
      razorpayPayoutId: data.razorpayPayoutId,
      failureReason: data.failureReason,
      requestedAt: timestampToDate(data.requestedAt),
      completedAt: data.completedAt ? timestampToDate(data.completedAt) : undefined,
    };
  });
};

export const updateAdminWithdrawal = async (id: string, updates: Partial<AdminWithdrawal>): Promise<void> => {
  const updateData = { ...updates };
  if (updateData.completedAt) {
    updateData.completedAt = serverTimestamp();
  }
  await updateDoc(doc(db, ADMIN_WITHDRAWALS_COLLECTION, id), updateData);
};

// Analytics operations
export const getTotalUsers = async (): Promise<number> => {
  const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
  return querySnapshot.size;
};

export const getTotalRevenue = async (): Promise<number> => {
  const q = query(collection(db, PAYMENTS_COLLECTION), where("status", "==", "success"));
  const querySnapshot = await getDocs(q);
  let total = 0;
  querySnapshot.docs.forEach(doc => {
    total += doc.data().amount || 0;
  });
  return total;
};

export const getRecentPayments = async (limitCount: number = 10): Promise<Payment[]> => {
  const q = query(
    collection(db, PAYMENTS_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      channelId: data.channelId,
      subscriptionId: data.subscriptionId,
      email: data.email,
      amount: data.amount,
      paymentType: data.paymentType,
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
      status: data.status,
      paymentMethod: data.paymentMethod,
      createdAt: timestampToDate(data.createdAt),
      completedAt: data.completedAt ? timestampToDate(data.completedAt) : undefined,
    };
  });
};