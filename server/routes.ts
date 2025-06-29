import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertChannelSchema, insertPaymentSchema, insertWithdrawalSchema, insertSubscriptionSchema } from "@shared/schema";
import { createHmac } from "crypto";
import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY || "rzp_test_default";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_KEY || "razorpay_secret";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Get all active channels
  app.get("/api/channels", async (req, res) => {
    try {
      const channels = await storage.getActiveChannels();
      res.json(channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ message: "Failed to fetch channels" });
    }
  });

  // Get channel by slug
  app.get("/api/channels/:slug", async (req, res) => {
    try {
      const channel = await storage.getChannelBySlug(req.params.slug);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
      res.json(channel);
    } catch (error) {
      console.error("Error fetching channel:", error);
      res.status(500).json({ message: "Failed to fetch channel" });
    }
  });

  // Create subscription order
  app.post("/api/subscriptions/create-order", async (req, res) => {
    try {
      const { channelId, email, paymentMethod, subscriptionType = "monthly" } = req.body;
      
      const channel = await storage.getChannel(channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

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

      // Generate unique access link
      const accessLink = `https://t.me/+${Math.random().toString(36).substring(2, 15)}`;

      // Create subscription record
      const subscription = await storage.createSubscription({
        userId: req.user?.id,
        channelId,
        email,
        accessLink,
        status: "active",
        subscriptionType,
        amount: channel.price,
        currentPeriodStart,
        currentPeriodEnd,
        nextBillingDate,
      });

      // Create initial payment record
      const payment = await storage.createPayment({
        userId: req.user?.id,
        channelId,
        subscriptionId: subscription.id,
        email,
        amount: channel.price,
        paymentType: "subscription",
        status: "pending",
        paymentMethod,
      });

      // Create Razorpay order
      const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: Math.round(parseFloat(channel.price) * 100), // Amount in paise
        currency: "INR",
        receipt: `sub_${subscription.id}_${payment.id}`,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);
      
      // Update payment with Razorpay order ID
      await storage.updatePayment(payment.id, {
        razorpayOrderId: order.id,
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID,
        paymentId: payment.id,
        subscriptionId: subscription.id,
        subscriptionType,
        nextBillingDate: nextBillingDate.toISOString(),
      });
    } catch (error) {
      console.error("Error creating subscription order:", error);
      res.status(500).json({ message: "Failed to create subscription order" });
    }
  });

  // Create Razorpay order (one-time payment - legacy)
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const { channelId, email, paymentMethod } = req.body;
      
      const channel = await storage.getChannel(channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      // Create payment record
      const payment = await storage.createPayment({
        userId: req.user?.id,
        channelId,
        email,
        amount: channel.price,
        status: "pending",
        paymentMethod,
      });

      // Create Razorpay order
      const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: Math.round(parseFloat(channel.price) * 100), // Amount in paise
        currency: "INR",
        receipt: `order_${payment.id}`,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);
      
      // Update payment with Razorpay order ID
      await storage.updatePayment(payment.id, {
        razorpayOrderId: order.id,
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID,
        paymentId: payment.id,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Verify payment
  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
      
      const expectedSignature = createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      // Update payment as successful
      const payment = await storage.updatePayment(paymentId, {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "success",
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Get channel details
      const channel = await storage.getChannel(payment.channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      let accessLink = channel.telegramLink;
      let isSubscription = false;

      // Handle subscription payment
      if (payment.subscriptionId) {
        isSubscription = true;
        // Get subscription details and use its access link
        const subscription = await storage.getSubscription(payment.subscriptionId);
        if (subscription) {
          accessLink = subscription.accessLink;
        }
      }

      // Create purchase record with access link
      const purchase = await storage.createPurchase({
        userId: payment.userId,
        channelId: payment.channelId,
        paymentId: payment.id,
        email: payment.email,
        accessLink,
        isActive: true,
      });

      res.json({
        success: true,
        accessLink,
        channelName: channel.name,
        purchaseId: purchase.id,
        isSubscription,
        subscriptionId: payment.subscriptionId,
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  // Get user subscriptions
  app.get("/api/subscriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const subscriptions = await storage.getUserSubscriptions(req.user.id);
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  // Cancel subscription
  app.post("/api/subscriptions/:id/cancel", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const subscriptionId = parseInt(req.params.id);
      const subscription = await storage.getSubscription(subscriptionId);
      
      if (!subscription || subscription.userId !== req.user.id) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      const cancelledSubscription = await storage.cancelSubscription(subscriptionId);
      res.json(cancelledSubscription);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // Get user purchases
  app.get("/api/purchases", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const purchases = await storage.getUserPurchases(req.user.id);
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  // Admin routes
  app.use("/api/admin/*", (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  });

  // Admin: Get all channels
  app.get("/api/admin/channels", async (req, res) => {
    try {
      const channels = await storage.getAllChannels();
      res.json(channels);
    } catch (error) {
      console.error("Error fetching admin channels:", error);
      res.status(500).json({ message: "Failed to fetch channels" });
    }
  });

  // Admin: Create channel
  app.post("/api/admin/channels", async (req, res) => {
    try {
      const validatedData = insertChannelSchema.parse(req.body);
      const channel = await storage.createChannel(validatedData);
      res.status(201).json(channel);
    } catch (error) {
      console.error("Error creating channel:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid channel data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create channel" });
    }
  });

  // Admin: Update channel
  app.put("/api/admin/channels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertChannelSchema.partial().parse(req.body);
      const channel = await storage.updateChannel(id, updates);
      
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
      
      res.json(channel);
    } catch (error) {
      console.error("Error updating channel:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update channel" });
    }
  });

  // Admin: Delete channel
  app.delete("/api/admin/channels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteChannel(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Channel not found" });
      }
      
      res.json({ message: "Channel deleted successfully" });
    } catch (error) {
      console.error("Error deleting channel:", error);
      res.status(500).json({ message: "Failed to delete channel" });
    }
  });

  // Admin: Get analytics
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const [totalUsers, totalRevenue, availableBalance, totalWithdrawn] = await Promise.all([
        storage.getTotalUsers(),
        storage.getTotalRevenue(),
        storage.getAvailableBalance(),
        storage.getTotalWithdrawn(),
      ]);

      const activeChannels = await storage.getActiveChannels();
      
      res.json({
        totalUsers,
        totalRevenue,
        availableBalance,
        totalWithdrawn,
        activeChannels: activeChannels.length,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin: Get all payments
  app.get("/api/admin/payments", async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Admin: Request withdrawal
  app.post("/api/admin/withdrawals", async (req, res) => {
    try {
      const validatedData = insertWithdrawalSchema.parse({
        ...req.body,
        amount: req.body.amount.toString(),
        requestedBy: req.user!.id,
      });
      
      const withdrawal = await storage.createWithdrawal(validatedData);
      res.status(201).json(withdrawal);
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid withdrawal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create withdrawal" });
    }
  });

  // Admin: Get all withdrawals
  app.get("/api/admin/withdrawals", async (req, res) => {
    try {
      const withdrawals = await storage.getAllWithdrawals();
      res.json(withdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
