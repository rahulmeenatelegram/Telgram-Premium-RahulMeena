import { storage } from './storage';

/**
 * Email Reminder Service for Subscription Renewals
 * 
 * Sends automated email reminders:
 * - 7 days before subscription expires
 * - 1 day before subscription expires  
 * - 1 day after subscription expires (grace period reminder)
 */

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailReminderService {
  private static instance: EmailReminderService;

  private constructor() {}

  public static getInstance(): EmailReminderService {
    if (!EmailReminderService.instance) {
      EmailReminderService.instance = new EmailReminderService();
    }
    return EmailReminderService.instance;
  }

  /**
   * Send renewal reminder emails to subscribers
   */
  public async sendRenewalReminders(): Promise<void> {
    console.log("Checking for subscriptions requiring renewal reminders...");

    try {
      // Get subscriptions expiring in 7 days
      const expiringSoon = await this.getSubscriptionsExpiringInDays(7);
      
      // Get subscriptions expiring in 1 day
      const expiringTomorrow = await this.getSubscriptionsExpiringInDays(1);
      
      // Get expired subscriptions in grace period
      const expiredInGrace = await this.getExpiredSubscriptionsInGracePeriod();

      // Send 7-day reminders
      for (const subscription of expiringSoon) {
        if (!subscription.renewalReminderSent) {
          await this.sendReminderEmail(subscription, 'expiring_soon');
          await storage.updateSubscription(subscription.id, { renewalReminderSent: true });
        }
      }

      // Send 1-day reminders
      for (const subscription of expiringTomorrow) {
        await this.sendReminderEmail(subscription, 'expiring_tomorrow');
      }

      // Send grace period reminders
      for (const subscription of expiredInGrace) {
        await this.sendReminderEmail(subscription, 'grace_period');
      }

      console.log(`Sent renewal reminders: ${expiringSoon.length + expiringTomorrow.length + expiredInGrace.length} emails`);
    } catch (error) {
      console.error("Error sending renewal reminders:", error);
    }
  }

  /**
   * Get subscriptions expiring in specified number of days
   */
  private async getSubscriptionsExpiringInDays(days: number): Promise<any[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    targetDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    // This would be implemented in storage layer
    return await storage.getSubscriptionsExpiringBetween(targetDate, endDate);
  }

  /**
   * Get expired subscriptions still in grace period
   */
  private async getExpiredSubscriptionsInGracePeriod(): Promise<any[]> {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

    // This would be implemented in storage layer
    return await storage.getExpiredSubscriptionsInGracePeriod(threeDaysAgo, now);
  }

  /**
   * Send reminder email based on type
   */
  private async sendReminderEmail(subscription: any, type: 'expiring_soon' | 'expiring_tomorrow' | 'grace_period'): Promise<void> {
    const channel = await storage.getChannel(subscription.channelId);
    const template = this.getEmailTemplate(type, subscription, channel);

    try {
      // In production, integrate with email service like SendGrid
      await this.sendEmail(subscription.email, template);
      console.log(`Sent ${type} reminder to ${subscription.email}`);
    } catch (error) {
      console.error(`Failed to send ${type} reminder to ${subscription.email}:`, error);
    }
  }

  /**
   * Get email template based on reminder type
   */
  private getEmailTemplate(type: string, subscription: any, channel: any): EmailTemplate {
    const platformName = "Onetapay";
    const accessLink = `${process.env.BASE_URL || 'https://your-domain.com'}/access/${subscription.accessToken}`;
    const renewalLink = `${process.env.BASE_URL || 'https://your-domain.com'}/access/${subscription.accessToken}`;

    switch (type) {
      case 'expiring_soon':
        return {
          subject: `⏰ Your ${channel?.name} subscription expires in 7 days`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Subscription Renewal Reminder</h2>
              <p>Hi there,</p>
              <p>Your subscription to <strong>${channel?.name}</strong> will expire in 7 days.</p>
              <p><strong>Expiry Date:</strong> ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
              <p>To continue enjoying uninterrupted access, please renew your subscription:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${renewalLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Renew Subscription
                </a>
              </div>
              <p><strong>Important:</strong> After expiry, you'll have a 3-day grace period before access is completely blocked.</p>
              <p>Need help? Reply to this email or contact our support team.</p>
              <hr>
              <p style="color: #666; font-size: 12px;">
                This is an automated reminder from ${platformName}. You received this because you have an active subscription.
              </p>
            </div>
          `,
          text: `Your ${channel?.name} subscription expires in 7 days. Renew at: ${renewalLink}`
        };

      case 'expiring_tomorrow':
        return {
          subject: `🚨 URGENT: Your ${channel?.name} subscription expires tomorrow`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ff6b35;">⚠️ Urgent: Subscription Expiring Soon</h2>
              <p>Hi there,</p>
              <p>Your subscription to <strong>${channel?.name}</strong> expires <strong>tomorrow</strong>!</p>
              <p><strong>Expiry Date:</strong> ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
              <p>Renew now to avoid any interruption in service:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${renewalLink}" style="background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Renew Now - Don't Lose Access
                </a>
              </div>
              <p><strong>Grace Period:</strong> You'll have 3 days after expiry before access is completely blocked.</p>
              <p>Questions? Reply to this email immediately.</p>
              <hr>
              <p style="color: #666; font-size: 12px;">
                This is an automated reminder from ${platformName}.
              </p>
            </div>
          `,
          text: `URGENT: Your ${channel?.name} subscription expires tomorrow! Renew at: ${renewalLink}`
        };

      case 'grace_period':
        return {
          subject: `❌ Your ${channel?.name} subscription has expired - Grace period active`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc3545;">Your Subscription Has Expired</h2>
              <p>Hi there,</p>
              <p>Your subscription to <strong>${channel?.name}</strong> expired on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.</p>
              <p><strong>Grace Period:</strong> You still have access for a few more days, but it will be blocked soon.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${renewalLink}" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Renew Now to Keep Access
                </a>
              </div>
              <p><strong>Action Required:</strong> Renew immediately to avoid losing access completely.</p>
              <p>Need assistance? Contact support right away.</p>
              <hr>
              <p style="color: #666; font-size: 12px;">
                This is an automated notice from ${platformName}.
              </p>
            </div>
          `,
          text: `Your ${channel?.name} subscription has expired. Grace period active. Renew at: ${renewalLink}`
        };

      default:
        throw new Error(`Unknown email template type: ${type}`);
    }
  }

  /**
   * Send email using configured email service
   */
  private async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    // In production, integrate with SendGrid or similar service
    console.log(`📧 Email sent to ${to}: ${template.subject}`);
    
    // For development, just log the email content
    if (process.env.NODE_ENV === 'development') {
      console.log(`--- EMAIL CONTENT ---`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${template.subject}`);
      console.log(`Text: ${template.text}`);
      console.log(`--- END EMAIL ---`);
    }
  }

  /**
   * Start the email reminder scheduler
   */
  public startScheduler(): void {
    // Check for reminders every hour
    setInterval(() => {
      this.sendRenewalReminders();
    }, 60 * 60 * 1000); // 1 hour

    // Send initial check
    this.sendRenewalReminders();
    console.log("Email reminder scheduler started");
  }
}

export const emailReminderService = EmailReminderService.getInstance();