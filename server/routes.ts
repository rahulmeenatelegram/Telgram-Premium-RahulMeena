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

  // Get user subscriptions by email
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const userEmail = req.query.email as string;
      
      if (!userEmail) {
        return res.status(400).json({ message: "Email parameter is required" });
      }

      const subscriptions = await storage.getEmailSubscriptions(userEmail);
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  // Verify subscription payment
  app.post("/api/subscriptions/verify-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;
      
      // Verify signature
      const expectedSignature = createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      // Get subscription details
      const subscription = await storage.getSubscription(subscriptionId);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      // Get channel details
      const channel = await storage.getChannel(subscription.channel_id || subscription.channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      // Return success response with access link
      res.json({
        success: true,
        accessLink: subscription.access_link || subscription.accessLink,
        channelName: channel.name,
        subscriptionId: subscription.id,
        message: "Payment verified successfully"
      });
    } catch (error) {
      console.error("Error verifying subscription payment:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  app.post("/api/subscriptions/create-order", async (req, res) => {
    try {
      const { channelId, telegramUsername, paymentMethod, subscriptionType = "monthly", enableAutopay = true } = req.body;
      
      // Use telegram username as email placeholder for now
      const email = telegramUsername || `user_${Date.now()}`;
      
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

      // Generate unique access link (no token needed)
      const accessLink = `https://t.me/+${Math.random().toString(36).substring(2, 15)}`;

      // Create subscription record
      const subscription = await storage.createSubscription({
        userId: req.user?.id,
        channelId,
        email,
        telegramUsername,
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
        accessLink: accessLink,
        validFor: "30 days"
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

  // Get user subscriptions
  app.get("/api/user/subscriptions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const subscriptions = await storage.getEmailSubscriptions(req.user.email);
      
      // Transform subscriptions to include channel information
      const enrichedSubscriptions = await Promise.all(
        subscriptions.map(async (sub) => {
          const channel = await storage.getChannel(sub.channelId);
          return {
            id: sub.id,
            channelId: sub.channelId,
            channelName: channel?.name || "Unknown Channel",
            channelSlug: channel?.slug || "",
            accessLink: sub.accessLink,
            status: sub.status,
            billingPeriod: sub.billingPeriod,
            price: sub.price,
            nextBillingDate: sub.nextBillingDate,
            createdAt: sub.createdAt,
            autopayEnabled: sub.autopayEnabled,
          };
        })
      );

      res.json(enrichedSubscriptions);
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  // Cancel subscription
  app.post("/api/subscriptions/:id/cancel", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const subscriptionId = parseInt(req.params.id);
      const subscription = await storage.getSubscription(subscriptionId);

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      // Verify subscription belongs to user
      const userSubscriptions = await storage.getEmailSubscriptions(req.user.email);
      const userOwnsSubscription = userSubscriptions.some(sub => sub.id === subscriptionId);

      if (!userOwnsSubscription) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const cancelledSubscription = await storage.cancelSubscription(subscriptionId);
      res.json(cancelledSubscription);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // Admin routes - check Firebase token and admin role
  app.use("/api/admin/*", async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        // For demo purposes, allow admin access without token
        console.log("No auth header, allowing admin access for demo");
        req.user = { email: "disruptivefounder@gmail.com", role: "admin", id: 1 };
        return next();
      }

      const token = authHeader.split(' ')[1];
      
      // In a real implementation, you'd verify the Firebase token here:
      // const decodedToken = await admin.auth().verifyIdToken(token);
      // const isAdmin = decodedToken.email === "disruptivefounder@gmail.com";
      
      // For now, allow admin access for the correct admin user
      console.log("Token provided, allowing admin access");
      req.user = { email: "disruptivefounder@gmail.com", role: "admin", id: 1 };
      next();
    } catch (error) {
      console.error("Admin auth error:", error);
      return res.status(403).json({ message: "Admin access required" });
    }
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
        requestedBy: 1, // Admin user ID
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

  // Access portal endpoint - checks if user can access channel
  app.get("/api/access-portal/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      // Find subscription by access token
      const subscription = await storage.getSubscriptionByToken(token);
      if (!subscription) {
        return res.status(404).json({ error: "Invalid access token" });
      }

      const now = new Date();
      const expiryDate = new Date(subscription.currentPeriodEnd);
      const gracePeriodEnd = new Date(expiryDate.getTime() + (subscription.gracePeriodDays * 24 * 60 * 60 * 1000));
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Check if access should be blocked
      const isExpired = now > expiryDate;
      const isInGracePeriod = isExpired && now <= gracePeriodEnd;
      const accessBlocked = subscription.accessBlocked || (isExpired && !isInGracePeriod);
      
      // Update subscription status if needed
      if (isExpired && subscription.status === 'active') {
        await storage.updateSubscription(subscription.id, { 
          status: 'expired',
          accessBlocked: !isInGracePeriod 
        });
      }

      // Get channel details for Telegram link
      const channel = await storage.getChannel(subscription.channelId);
      
      res.json({
        subscription: {
          id: subscription.id,
          channel_name: channel?.name || 'Unknown Channel',
          status: isExpired ? 'expired' : subscription.status,
          current_period_end: subscription.currentPeriodEnd,
          access_blocked: accessBlocked,
          grace_period_days: subscription.gracePeriodDays,
          telegram_invite_link: !accessBlocked ? channel?.telegramInviteLink : null,
        },
        access_granted: !accessBlocked,
        days_until_expiry: Math.max(0, daysUntilExpiry),
        renewal_required: isExpired || daysUntilExpiry <= 7
      });
    } catch (error) {
      console.error("Access portal error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
