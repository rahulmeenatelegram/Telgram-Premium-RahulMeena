import type { Express } from "express";
import { createServer, type Server } from "http";
import { createHmac } from "crypto";
import Razorpay from "razorpay";
import { adminDb } from "./firebase-admin";

// Firebase admin wallet functions
async function updateAdminWalletBalance(amount: number, type: "credit" | "debit", description: string, reference?: string) {
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

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY || "rzp_test_default";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_KEY || "razorpay_secret";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all active channels from Firebase
  app.get("/api/channels", async (req, res) => {
    try {
      const channelsRef = adminDb.ref('channels');
      const snapshot = await channelsRef.orderByChild('isActive').equalTo(true).once('value');
      const channelsData = snapshot.val() || {};
      
      const channels = Object.keys(channelsData).map(key => ({
        id: key,
        ...channelsData[key]
      }));
      
      res.json(channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ message: "Failed to fetch channels" });
    }
  });

  // Get channel by slug from Firebase
  app.get("/api/channels/:slug", async (req, res) => {
    try {
      const channelsRef = adminDb.ref('channels');
      const snapshot = await channelsRef.orderByChild('slug').equalTo(req.params.slug).once('value');
      const channelsData = snapshot.val();
      
      if (!channelsData) {
        return res.status(404).json({ message: "Channel not found" });
      }
      
      const channelId = Object.keys(channelsData)[0];
      const channel = { id: channelId, ...channelsData[channelId] };
      
      res.json(channel);
    } catch (error) {
      console.error("Error fetching channel:", error);
      res.status(500).json({ message: "Failed to fetch channel" });
    }
  });

  // Create subscription order with Firebase storage
  app.post("/api/subscriptions/create-order", async (req, res) => {
    try {
      const { channelId, email, paymentMethod, subscriptionType = "monthly" } = req.body;
      
      // Get channel by slug from Firebase
      const channelsRef = adminDb.ref('channels');
      const snapshot = await channelsRef.orderByChild('slug').equalTo(channelId).once('value');
      const channelsData = snapshot.val();
      
      if (!channelsData) {
        return res.status(404).json({ message: "Channel not found" });
      }
      
      const channelKey = Object.keys(channelsData)[0];
      const channel = { id: channelKey, ...channelsData[channelKey] };

      // Calculate subscription period dates
      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      const nextBillingDate = new Date();
      
      if (subscriptionType === "monthly") {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (subscriptionType === "yearly") {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }

      // Create subscription record in Firebase
      const subscriptionRef = adminDb.ref('subscriptions').push();
      const subscriptionData = {
        id: subscriptionRef.key,
        channelId: channel.id,
        email,
        accessLink: channel.telegramLink,
        status: "active",
        subscriptionType,
        amount: channel.price,
        currentPeriodStart: currentPeriodStart.getTime(),
        currentPeriodEnd: currentPeriodEnd.getTime(),
        nextBillingDate: nextBillingDate.getTime(),
        createdAt: Date.now(),
      };
      await subscriptionRef.set(subscriptionData);

      // Create initial payment record in Firebase
      const paymentRef = adminDb.ref('payments').push();
      const paymentData = {
        id: paymentRef.key,
        channelId: channel.id,
        subscriptionId: subscriptionRef.key,
        email,
        amount: channel.price,
        paymentType: "subscription",
        status: "pending",
        paymentMethod,
        razorpayOrderId: "",
        razorpayPaymentId: "",
        razorpaySignature: "",
        createdAt: Date.now(),
      };
      await paymentRef.set(paymentData);

      // Create Razorpay order
      const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: Math.round(Number(channel.price) * 100), // Amount in paise
        currency: "INR",
        receipt: `sub_${subscriptionRef.key}_${paymentRef.key}`,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);
      
      // Update payment with Razorpay order ID in Firebase
      await paymentRef.update({
        razorpayOrderId: order.id,
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID,
        paymentId: paymentRef.key,
        subscriptionId: subscriptionRef.key,
        subscriptionType,
        nextBillingDate: nextBillingDate.toISOString(),
      });
    } catch (error) {
      console.error("Error creating subscription order:", error);
      res.status(500).json({ message: "Failed to create subscription order" });
    }
  });

  // Payment verification with Firebase storage
  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

      // Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        // Update payment status in Firebase
        const paymentRef = adminDb.ref(`payments/${paymentId}`);
        await paymentRef.update({
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "success",
          completedAt: Date.now(),
        });

        // Get payment details
        const paymentSnapshot = await paymentRef.once('value');
        const payment = paymentSnapshot.val();

        if (payment && payment.subscriptionId) {
          // Get subscription details
          const subscriptionSnapshot = await adminDb.ref(`subscriptions/${payment.subscriptionId}`).once('value');
          const subscription = subscriptionSnapshot.val();
          
          // Get channel details
          const channelSnapshot = await adminDb.ref(`channels/${payment.channelId}`).once('value');
          const channel = channelSnapshot.val();

          // Update admin wallet balance
          await updateAdminWalletBalance(
            Number(payment.amount),
            "credit",
            `Payment for subscription ${payment.subscriptionId}`,
            razorpay_payment_id
          );

          res.json({
            success: true,
            accessLink: subscription?.accessLink,
            channelName: channel?.name,
            message: "Payment successful! Access link sent to your email."
          });
        } else {
          res.json({
            success: true,
            message: "Payment successful!"
          });
        }
      } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ success: false, message: "Payment verification failed" });
    }
  });

  // Admin routes with Firebase backend
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const admin = await import("firebase-admin");
      const db = admin.database();

      // Get total users
      const usersSnapshot = await db.ref('users').once('value');
      const users = usersSnapshot.val() || {};
      const totalUsers = Object.keys(users).length;

      // Get total revenue from payments
      const paymentsSnapshot = await db.ref('payments').orderByChild('status').equalTo('success').once('value');
      const payments = paymentsSnapshot.val() || {};
      const totalRevenue = Object.values(payments).reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0);

      // Get admin wallet
      const wallet = await FirebaseAdminService.getWalletBalance();

      res.json({
        totalUsers,
        totalRevenue,
        availableBalance: wallet,
        totalWithdrawn: 0, // Calculate from withdrawal records if needed
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin instant withdrawal with Razorpay Payouts
  app.post("/api/admin/instant-withdrawal", async (req, res) => {
    try {
      const { amount, withdrawalMethod, accountDetails } = req.body;

      // Validate admin user
      if (!req.user || req.user.email !== 'disruptivefounder@gmail.com') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Check wallet balance
      const currentBalance = await FirebaseAdminService.getWalletBalance();
      if (currentBalance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Process instant withdrawal using Razorpay Payouts
      const result = await FirebaseAdminService.createInstantWithdrawal(
        amount,
        withdrawalMethod,
        accountDetails,
        req.user.email
      );

      if (result.success) {
        res.json({
          success: true,
          message: "Withdrawal processed successfully",
          payoutId: result.payoutId,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error || "Withdrawal failed",
        });
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Withdrawal processing failed" });
    }
  });

  // Get recent payments
  app.get("/api/admin/recent-payments", async (req, res) => {
    try {
      const admin = await import("firebase-admin");
      const db = admin.database();
      
      const paymentsSnapshot = await db.ref('payments')
        .orderByChild('createdAt')
        .limitToLast(10)
        .once('value');
      
      const payments = paymentsSnapshot.val() || {};
      const recentPayments = Object.values(payments).reverse();

      res.json(recentPayments);
    } catch (error) {
      console.error("Error fetching recent payments:", error);
      res.status(500).json({ message: "Failed to fetch recent payments" });
    }
  });

  // Get admin wallet transactions
  app.get("/api/admin/wallet-transactions", async (req, res) => {
    try {
      const admin = await import("firebase-admin");
      const db = admin.database();
      
      const transactionsSnapshot = await db.ref('adminWalletTransactions')
        .orderByChild('createdAt')
        .limitToLast(20)
        .once('value');
      
      const transactions = transactionsSnapshot.val() || {};
      const recentTransactions = Object.values(transactions).reverse();

      res.json(recentTransactions);
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
      res.status(500).json({ message: "Failed to fetch wallet transactions" });
    }
  });

  // Get admin wallet balance
  app.get("/api/admin/wallet", async (req, res) => {
    try {
      const balance = await FirebaseAdminService.getWalletBalance();
      
      res.json({
        id: "main",
        balance,
        totalEarnings: balance,
        totalWithdrawn: 0,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      res.status(500).json({ message: "Failed to fetch wallet balance" });
    }
  });

  const server = createServer(app);
  return server;
}