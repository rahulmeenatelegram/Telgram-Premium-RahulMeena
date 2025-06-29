import { db } from "./firebase";
import { ref, get, set } from "firebase/database";

// Initialize Firebase Realtime Database and admin wallet
export async function initializeFirebaseCollections() {
  try {
    // Initialize admin wallet if it doesn't exist
    const walletRef = ref(db, "adminWallet/main");
    const walletSnapshot = await get(walletRef);
    
    if (!walletSnapshot.exists()) {
      await set(walletRef, {
        id: "main",
        balance: 10000,
        totalEarnings: 10000,
        totalWithdrawn: 0,
        updatedAt: new Date().getTime(),
      });
      console.log("Admin wallet initialized with test balance");
    }

    // Create test channels if they don't exist
    const testChannels = [
      {
        id: "premium-trading",
        name: "Premium Trading Signals",
        slug: "premium-trading",
        description: "Get exclusive trading signals and market analysis from expert traders. Join our community of successful traders!",
        price: 299,
        subscriptionType: "monthly",
        telegramLink: "https://t.me/+testlink1",
        memberCount: 1500,
        icon: "📈",
        isActive: true,
        createdAt: new Date().getTime(),
      },
      {
        id: "crypto-news-vip",
        name: "Crypto News VIP",
        slug: "crypto-news-vip",
        description: "Breaking crypto news, insider information, and market updates before anyone else.",
        price: 499,
        subscriptionType: "monthly",
        telegramLink: "https://t.me/+testlink2",
        memberCount: 2300,
        icon: "🚀",
        isActive: true,
        createdAt: new Date().getTime(),
      },
      {
        id: "stock-mastery",
        name: "Stock Market Mastery",
        slug: "stock-mastery",
        description: "Learn advanced stock trading strategies and get daily market insights from professionals.",
        price: 1999,
        subscriptionType: "yearly",
        telegramLink: "https://t.me/+testlink3",
        memberCount: 850,
        icon: "💹",
        isActive: true,
        createdAt: new Date().getTime(),
      },
    ];

    for (const channel of testChannels) {
      const channelRef = ref(db, `channels/${channel.id}`);
      const channelSnapshot = await get(channelRef);
      
      if (!channelSnapshot.exists()) {
        await set(channelRef, channel);
        console.log(`Created test channel: ${channel.name}`);
      }
    }

    // Add some test transactions to admin wallet
    const testTransactions = [
      {
        id: "test-transaction-1",
        type: "credit",
        amount: 10000,
        description: "Initial test balance",
        reference: "init-balance",
        balanceAfter: 10000,
        createdAt: new Date().getTime(),
      },
      {
        id: "test-transaction-2",
        type: "credit",
        amount: 299,
        description: "Test subscription payment - Premium Trading Signals",
        reference: "test-payment-1",
        balanceAfter: 10299,
        createdAt: new Date().getTime(),
      },
      {
        id: "test-transaction-3",
        type: "credit",
        amount: 499,
        description: "Test subscription payment - Crypto News VIP",
        reference: "test-payment-2",
        balanceAfter: 10798,
        createdAt: new Date().getTime(),
      },
    ];

    for (let i = 0; i < testTransactions.length; i++) {
      const transaction = testTransactions[i];
      const transactionRef = ref(db, `adminWalletTransactions/${transaction.id}`);
      const transactionSnapshot = await get(transactionRef);
      
      if (!transactionSnapshot.exists()) {
        await set(transactionRef, transaction);
      }
    }

    console.log("Firebase collections initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase collections:", error);
  }
}

// Auto-initialize on first load
if (typeof window !== "undefined") {
  setTimeout(() => {
    initializeFirebaseCollections();
  }, 3000);
}