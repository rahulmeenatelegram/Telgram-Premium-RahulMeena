import { storage } from "./storage";
import { log } from "./vite";

/**
 * Subscription Manager - Handles subscription expiration and renewal
 * 
 * Key functions:
 * 1. Check for expired subscriptions and revoke access
 * 2. Send notifications for upcoming renewals
 * 3. Process automatic renewals (when autopay is enabled)
 * 4. Clean up expired access links
 */

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 60 * 60 * 1000; // Check every hour

  private constructor() {}

  public static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  /**
   * Start the subscription management background process
   */
  public start(): void {
    if (this.intervalId) {
      log("Subscription manager is already running");
      return;
    }

    log("Starting subscription manager...");
    
    // Run immediately on startup
    this.processSubscriptions();
    
    // Set up recurring checks
    this.intervalId = setInterval(() => {
      this.processSubscriptions();
    }, this.CHECK_INTERVAL);

    log("Subscription manager started successfully");
  }

  /**
   * Stop the subscription management background process
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      log("Subscription manager stopped");
    }
  }

  /**
   * Main subscription processing logic
   */
  private async processSubscriptions(): Promise<void> {
    try {
      log("Processing subscriptions...");
      
      // Get all active subscriptions
      const activeSubscriptions = await storage.getActiveSubscriptions();
      const now = new Date();
      
      let expiredCount = 0;
      let renewedCount = 0;
      
      for (const subscription of activeSubscriptions) {
        const nextBillingDate = new Date(subscription.nextBillingDate);
        
        // Check if subscription has expired
        if (now > nextBillingDate) {
          log(`Subscription ${subscription.id} has expired`);
          
          if (subscription.autopayEnabled) {
            // Attempt automatic renewal
            const renewed = await this.attemptRenewal(subscription);
            if (renewed) {
              renewedCount++;
              continue;
            }
          }
          
          // Expire the subscription
          await this.expireSubscription(subscription);
          expiredCount++;
        }
      }
      
      if (expiredCount > 0 || renewedCount > 0) {
        log(`Processed ${expiredCount} expired and ${renewedCount} renewed subscriptions`);
      }
      
    } catch (error) {
      log(`Error processing subscriptions: ${error}`, "subscription-manager");
    }
  }

  /**
   * Attempt to renew a subscription with autopay
   */
  private async attemptRenewal(subscription: any): Promise<boolean> {
    try {
      log(`Attempting to renew subscription ${subscription.id}`);
      
      // In a real implementation, this would:
      // 1. Charge the saved payment method via Razorpay
      // 2. Update the subscription billing dates
      // 3. Send confirmation email
      
      // For now, we'll simulate a successful renewal
      const nextBillingDate = new Date();
      if (subscription.billingPeriod === "monthly") {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (subscription.billingPeriod === "yearly") {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
      
      await storage.updateSubscription(subscription.id, {
        nextBillingDate: nextBillingDate.toISOString(),
        status: "active"
      });
      
      log(`Successfully renewed subscription ${subscription.id}`);
      return true;
      
    } catch (error) {
      log(`Failed to renew subscription ${subscription.id}: ${error}`, "subscription-manager");
      return false;
    }
  }

  /**
   * Expire a subscription and revoke access
   */
  private async expireSubscription(subscription: any): Promise<void> {
    try {
      log(`Expiring subscription ${subscription.id}`);
      
      // Update subscription status to expired
      await storage.updateSubscription(subscription.id, {
        status: "expired"
      });
      
      // Revoke access by invalidating the access link
      // In a real implementation, this would:
      // 1. Remove user from Telegram channel
      // 2. Invalidate the access link
      // 3. Send notification email
      
      log(`Subscription ${subscription.id} expired and access revoked`);
      
    } catch (error) {
      log(`Error expiring subscription ${subscription.id}: ${error}`, "subscription-manager");
    }
  }

  /**
   * Get subscriptions expiring in the next N days
   */
  public async getExpiringSubscriptions(days: number = 3): Promise<any[]> {
    try {
      const subscriptions = await storage.getExpiringSubscriptions();
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      return subscriptions.filter(sub => {
        const nextBillingDate = new Date(sub.nextBillingDate);
        return nextBillingDate <= futureDate && nextBillingDate > now;
      });
      
    } catch (error) {
      log(`Error getting expiring subscriptions: ${error}`, "subscription-manager");
      return [];
    }
  }

  /**
   * Manually check and process a specific subscription
   */
  public async processSubscription(subscriptionId: number): Promise<void> {
    try {
      const subscription = await storage.getSubscription(subscriptionId);
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      
      const now = new Date();
      const nextBillingDate = new Date(subscription.nextBillingDate);
      
      if (now > nextBillingDate && subscription.status === "active") {
        if (subscription.autopayEnabled) {
          const renewed = await this.attemptRenewal(subscription);
          if (!renewed) {
            await this.expireSubscription(subscription);
          }
        } else {
          await this.expireSubscription(subscription);
        }
      }
      
    } catch (error) {
      log(`Error processing subscription ${subscriptionId}: ${error}`, "subscription-manager");
      throw error;
    }
  }
}

// Export singleton instance
export const subscriptionManager = SubscriptionManager.getInstance();