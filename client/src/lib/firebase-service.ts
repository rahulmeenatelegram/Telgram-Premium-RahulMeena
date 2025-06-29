import { 
  ref, 
  get, 
  set, 
  push, 
  update, 
  remove,
  child,
  query,
  orderByChild,
  orderByKey,
  limitToLast,
  equalTo,
  serverTimestamp
} from "firebase/database";
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

// Database paths
const USERS_PATH = "users";
const CHANNELS_PATH = "channels";
const PAYMENTS_PATH = "payments";
const SUBSCRIPTIONS_PATH = "subscriptions";
const ADMIN_WALLET_PATH = "adminWallet";
const ADMIN_WALLET_TRANSACTIONS_PATH = "adminWalletTransactions";
const ADMIN_WITHDRAWALS_PATH = "adminWithdrawals";

// Helper function to generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Helper function to convert timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  return new Date(timestamp);
};

// User operations
export const createUser = async (userData: { uid: string; email: string; role: "admin" | "user" }): Promise<User> => {
  const userRef = ref(db, `${USERS_PATH}/${userData.uid}`);
  const user: User = {
    ...userData,
    createdAt: new Date(),
  };
  await set(userRef, {
    ...user,
    createdAt: user.createdAt.getTime(),
  });
  return user;
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = ref(db, `${USERS_PATH}/${uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
    };
  }
  return null;
};

// Channel operations
export const createChannel = async (channelData: InsertChannel): Promise<Channel> => {
  const channelId = generateId();
  const channelRef = ref(db, `${CHANNELS_PATH}/${channelId}`);
  const channel: Channel = {
    id: channelId,
    ...channelData,
    createdAt: new Date(),
  };
  await set(channelRef, {
    ...channel,
    createdAt: channel.createdAt.getTime(),
  });
  return channel;
};

export const getActiveChannels = async (): Promise<Channel[]> => {
  const channelsRef = ref(db, CHANNELS_PATH);
  const snapshot = await get(channelsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data).filter((channel: any) => channel.isActive).map((channel: any) => ({
      ...channel,
      createdAt: timestampToDate(channel.createdAt),
    }));
  }
  return [];
};

export const getChannelBySlug = async (slug: string): Promise<Channel | null> => {
  const channelsRef = ref(db, CHANNELS_PATH);
  const snapshot = await get(channelsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    const channel = Object.values(data).find((ch: any) => ch.slug === slug) as any;
    if (channel) {
      return {
        ...channel,
        createdAt: timestampToDate(channel.createdAt),
      };
    }
  }
  return null;
};

export const getChannel = async (id: string): Promise<Channel | null> => {
  const channelRef = ref(db, `${CHANNELS_PATH}/${id}`);
  const snapshot = await get(channelRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
    };
  }
  return null;
};

export const updateChannel = async (id: string, updates: Partial<InsertChannel>): Promise<Channel | null> => {
  const channelRef = ref(db, `${CHANNELS_PATH}/${id}`);
  const updateData: any = { ...updates };
  
  await update(channelRef, updateData);
  
  // Return updated channel
  const snapshot = await get(channelRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
    };
  }
  return null;
};

export const deleteChannel = async (id: string): Promise<boolean> => {
  const channelRef = ref(db, `${CHANNELS_PATH}/${id}`);
  await remove(channelRef);
  return true;
};

// Payment operations
export const createPayment = async (paymentData: InsertPayment): Promise<Payment> => {
  const paymentId = generateId();
  const paymentRef = ref(db, `${PAYMENTS_PATH}/${paymentId}`);
  const payment: Payment = {
    id: paymentId,
    ...paymentData,
    createdAt: new Date(),
  };
  await set(paymentRef, {
    ...payment,
    createdAt: payment.createdAt.getTime(),
    completedAt: payment.completedAt ? payment.completedAt.getTime() : null,
  });
  return payment;
};

export const updatePayment = async (id: string, updates: Partial<Payment>): Promise<void> => {
  const paymentRef = ref(db, `${PAYMENTS_PATH}/${id}`);
  const updateData: any = { ...updates };
  if (updateData.completedAt) {
    updateData.completedAt = updateData.completedAt.getTime();
  }
  await update(paymentRef, updateData);
};

export const getPaymentByRazorpayOrderId = async (orderId: string): Promise<Payment | null> => {
  const paymentsRef = ref(db, PAYMENTS_PATH);
  const snapshot = await get(paymentsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    const payment = Object.values(data).find((p: any) => p.razorpayOrderId === orderId) as any;
    if (payment) {
      return {
        ...payment,
        createdAt: timestampToDate(payment.createdAt),
        completedAt: payment.completedAt ? timestampToDate(payment.completedAt) : undefined,
      };
    }
  }
  return null;
};

// Subscription operations
export const createSubscription = async (subscriptionData: InsertSubscription): Promise<Subscription> => {
  const subscriptionId = generateId();
  const subscriptionRef = ref(db, `${SUBSCRIPTIONS_PATH}/${subscriptionId}`);
  const subscription: Subscription = {
    id: subscriptionId,
    ...subscriptionData,
    createdAt: new Date(),
  };
  await set(subscriptionRef, {
    ...subscription,
    createdAt: subscription.createdAt.getTime(),
    currentPeriodStart: subscription.currentPeriodStart.getTime(),
    currentPeriodEnd: subscription.currentPeriodEnd.getTime(),
    nextBillingDate: subscription.nextBillingDate.getTime(),
    cancelledAt: subscription.cancelledAt ? subscription.cancelledAt.getTime() : null,
  });
  return subscription;
};

export const getSubscription = async (id: string): Promise<Subscription | null> => {
  const subscriptionRef = ref(db, `${SUBSCRIPTIONS_PATH}/${id}`);
  const snapshot = await get(subscriptionRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      currentPeriodStart: timestampToDate(data.currentPeriodStart),
      currentPeriodEnd: timestampToDate(data.currentPeriodEnd),
      nextBillingDate: timestampToDate(data.nextBillingDate),
      cancelledAt: data.cancelledAt ? timestampToDate(data.cancelledAt) : undefined,
    };
  }
  return null;
};

// Admin Wallet operations
export const getAdminWallet = async (): Promise<AdminWallet> => {
  const walletRef = ref(db, `${ADMIN_WALLET_PATH}/main`);
  const snapshot = await get(walletRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      ...data,
      updatedAt: timestampToDate(data.updatedAt),
    };
  }
  // Return default wallet if not exists
  const defaultWallet: AdminWallet = {
    id: "main",
    balance: 0,
    totalEarnings: 0,
    totalWithdrawn: 0,
    updatedAt: new Date(),
  };
  await set(walletRef, {
    ...defaultWallet,
    updatedAt: defaultWallet.updatedAt.getTime(),
  });
  return defaultWallet;
};

export const updateAdminWalletBalance = async (
  amount: number,
  type: "credit" | "debit",
  description: string,
  reference?: string
): Promise<AdminWallet> => {
  const walletRef = ref(db, `${ADMIN_WALLET_PATH}/main`);
  const snapshot = await get(walletRef);
  
  let currentBalance = 0;
  let totalEarnings = 0;
  let totalWithdrawn = 0;
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    currentBalance = data.balance || 0;
    totalEarnings = data.totalEarnings || 0;
    totalWithdrawn = data.totalWithdrawn || 0;
  }
  
  const newBalance = type === "credit" ? currentBalance + amount : currentBalance - amount;
  const newTotalEarnings = type === "credit" ? totalEarnings + amount : totalEarnings;
  const newTotalWithdrawn = type === "debit" ? totalWithdrawn + amount : totalWithdrawn;
  
  const updatedWallet: AdminWallet = {
    id: "main",
    balance: newBalance,
    totalEarnings: newTotalEarnings,
    totalWithdrawn: newTotalWithdrawn,
    updatedAt: new Date(),
  };
  
  // Update wallet
  await set(walletRef, {
    ...updatedWallet,
    updatedAt: updatedWallet.updatedAt.getTime(),
  });
  
  // Create transaction record
  const transactionId = generateId();
  const transactionRef = ref(db, `${ADMIN_WALLET_TRANSACTIONS_PATH}/${transactionId}`);
  const transaction: AdminWalletTransaction = {
    id: transactionId,
    type,
    amount,
    description,
    reference,
    balanceAfter: newBalance,
    createdAt: new Date(),
  };
  
  await set(transactionRef, {
    ...transaction,
    createdAt: transaction.createdAt.getTime(),
  });
  
  return updatedWallet;
};

export const getAdminWalletTransactions = async (limit: number = 20): Promise<AdminWalletTransaction[]> => {
  const transactionsRef = ref(db, ADMIN_WALLET_TRANSACTIONS_PATH);
  const snapshot = await get(transactionsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    const transactions = Object.values(data).map((transaction: any) => ({
      ...transaction,
      createdAt: timestampToDate(transaction.createdAt),
    }));
    return transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  }
  return [];
};

// Admin Withdrawals operations
export const createAdminWithdrawal = async (withdrawalData: InsertAdminWithdrawal): Promise<AdminWithdrawal> => {
  const withdrawalId = generateId();
  const withdrawalRef = ref(db, `${ADMIN_WITHDRAWALS_PATH}/${withdrawalId}`);
  const withdrawal: AdminWithdrawal = {
    id: withdrawalId,
    ...withdrawalData,
    status: "pending",
    requestedAt: new Date(),
  };
  await set(withdrawalRef, {
    ...withdrawal,
    requestedAt: withdrawal.requestedAt.getTime(),
    completedAt: withdrawal.completedAt ? withdrawal.completedAt.getTime() : null,
  });
  return withdrawal;
};

export const getAdminWithdrawals = async (): Promise<AdminWithdrawal[]> => {
  const withdrawalsRef = ref(db, ADMIN_WITHDRAWALS_PATH);
  const snapshot = await get(withdrawalsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data).map((withdrawal: any) => ({
      ...withdrawal,
      requestedAt: timestampToDate(withdrawal.requestedAt),
      completedAt: withdrawal.completedAt ? timestampToDate(withdrawal.completedAt) : undefined,
    }));
  }
  return [];
};

export const updateAdminWithdrawal = async (id: string, updates: Partial<AdminWithdrawal>): Promise<void> => {
  const withdrawalRef = ref(db, `${ADMIN_WITHDRAWALS_PATH}/${id}`);
  const updateData: any = { ...updates };
  if (updateData.completedAt) {
    updateData.completedAt = updateData.completedAt.getTime();
  }
  await update(withdrawalRef, updateData);
};

// Analytics operations
export const getTotalUsers = async (): Promise<number> => {
  const usersRef = ref(db, USERS_PATH);
  const snapshot = await get(usersRef);
  if (snapshot.exists()) {
    return Object.keys(snapshot.val()).length;
  }
  return 0;
};

export const getTotalRevenue = async (): Promise<number> => {
  const paymentsRef = ref(db, PAYMENTS_PATH);
  const snapshot = await get(paymentsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data)
      .filter((payment: any) => payment.status === "success")
      .reduce((total: number, payment: any) => total + (payment.amount || 0), 0);
  }
  return 0;
};

export const getAvailableBalance = async (): Promise<number> => {
  const wallet = await getAdminWallet();
  return wallet.balance;
};

export const getTotalWithdrawn = async (): Promise<number> => {
  const wallet = await getAdminWallet();
  return wallet.totalWithdrawn;
};

export const getRecentPayments = async (limitCount: number = 10): Promise<Payment[]> => {
  const paymentsRef = ref(db, PAYMENTS_PATH);
  const snapshot = await get(paymentsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    const payments = Object.values(data).map((payment: any) => ({
      ...payment,
      createdAt: timestampToDate(payment.createdAt),
      completedAt: payment.completedAt ? timestampToDate(payment.completedAt) : undefined,
    }));
    return payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limitCount);
  }
  return [];
};

// Initialize admin wallet with test data
export const initializeAdminWallet = async (): Promise<void> => {
  const walletRef = ref(db, `${ADMIN_WALLET_PATH}/main`);
  const snapshot = await get(walletRef);
  
  if (!snapshot.exists()) {
    const initialWallet: AdminWallet = {
      id: "main",
      balance: 10000,
      totalEarnings: 10000,
      totalWithdrawn: 0,
      updatedAt: new Date(),
    };
    
    await set(walletRef, {
      ...initialWallet,
      updatedAt: initialWallet.updatedAt.getTime(),
    });
    
    // Add initial transactions
    const initialTransactions = [
      {
        type: "credit" as const,
        amount: 10000,
        description: "Initial test balance",
        reference: "init-balance",
        balanceAfter: 10000,
      },
      {
        type: "credit" as const,
        amount: 299,
        description: "Test subscription payment - Premium Trading Signals",
        reference: "test-payment-1",
        balanceAfter: 10299,
      },
      {
        type: "credit" as const,
        amount: 499,
        description: "Test subscription payment - Crypto News VIP",
        reference: "test-payment-2",
        balanceAfter: 10798,
      },
    ];
    
    for (let i = 0; i < initialTransactions.length; i++) {
      const transactionId = `init-transaction-${i + 1}`;
      const transactionRef = ref(db, `${ADMIN_WALLET_TRANSACTIONS_PATH}/${transactionId}`);
      const transaction = {
        id: transactionId,
        ...initialTransactions[i],
        createdAt: new Date().getTime(),
      };
      await set(transactionRef, transaction);
    }
  }
};