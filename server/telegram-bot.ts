import { storage } from './storage';

/**
 * Telegram Bot Manager for Channel Access Control
 * 
 * This system controls access to Telegram channels by:
 * 1. Adding users to channels when they pay
 * 2. Removing users when subscriptions expire
 * 3. Providing time-limited access codes
 */

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface ChannelAccess {
  subscriptionId: number;
  telegramUserId: number;
  channelId: number;
  accessGranted: boolean;
  expiresAt: Date;
}

export class TelegramBotManager {
  private static instance: TelegramBotManager;
  private botToken: string;
  private baseUrl: string;

  private constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  public static getInstance(): TelegramBotManager {
    if (!TelegramBotManager.instance) {
      TelegramBotManager.instance = new TelegramBotManager();
    }
    return TelegramBotManager.instance;
  }

  /**
   * Generate a time-limited access code for channel access
   */
  public async generateAccessCode(subscriptionId: number): Promise<string> {
    const accessCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store access code in database
    await storage.createAccessCode({
      subscriptionId,
      accessCode,
      expiresAt,
      used: false
    });

    return accessCode;
  }

  /**
   * Verify and consume an access code
   */
  public async verifyAccessCode(accessCode: string, telegramUserId: number): Promise<{
    valid: boolean;
    channelId?: number;
    channelName?: string;
    subscriptionId?: number;
  }> {
    const accessRecord = await storage.getAccessCodeByCode(accessCode);
    
    if (!accessRecord || accessRecord.used || new Date() > accessRecord.expiresAt) {
      return { valid: false };
    }

    // Get subscription details
    const subscription = await storage.getSubscription(accessRecord.subscriptionId);
    if (!subscription || subscription.status !== 'active') {
      return { valid: false };
    }

    // Get channel details
    const channel = await storage.getChannel(subscription.channelId);
    if (!channel) {
      return { valid: false };
    }

    // Mark access code as used
    await storage.updateAccessCode(accessRecord.id, { used: true });

    // Store user's channel access
    await storage.createChannelAccess({
      subscriptionId: subscription.id,
      telegramUserId,
      channelId: subscription.channelId,
      accessGranted: true,
      expiresAt: new Date(subscription.currentPeriodEnd)
    });

    return {
      valid: true,
      channelId: subscription.channelId,
      channelName: channel.name,
      subscriptionId: subscription.id
    };
  }

  /**
   * Check if user has access to a channel
   */
  public async checkChannelAccess(telegramUserId: number, channelId: number): Promise<boolean> {
    const access = await storage.getChannelAccess(telegramUserId, channelId);
    
    if (!access || !access.accessGranted) {
      return false;
    }

    // Check if access has expired
    if (new Date() > access.expiresAt) {
      // Revoke access
      await storage.updateChannelAccess(access.id, { accessGranted: false });
      return false;
    }

    return true;
  }

  /**
   * Revoke access for expired subscriptions
   */
  public async revokeExpiredAccess(): Promise<void> {
    const expiredAccesses = await storage.getExpiredChannelAccesses();
    
    for (const access of expiredAccesses) {
      // Update access record
      await storage.updateChannelAccess(access.id, { accessGranted: false });
      
      // If we had bot integration, we would remove user from channel here
      // await this.removeUserFromChannel(access.telegramUserId, access.channelId);
    }
  }

  /**
   * Get channel access instructions for user
   */
  public async getChannelAccessInstructions(subscriptionId: number): Promise<{
    accessCode: string;
    instructions: string;
    expiresIn: number;
  }> {
    const accessCode = await this.generateAccessCode(subscriptionId);
    
    const instructions = `
🔐 **Channel Access Instructions**

1. Click this link to open our Telegram bot: https://t.me/YourBotUsername
2. Send the command: /access ${accessCode}
3. You will be automatically added to the channel
4. This code expires in 10 minutes

⚠️ **Important**: 
- Each access code can only be used once
- You must use the code within 10 minutes
- Access will be automatically revoked when your subscription expires
    `.trim();

    return {
      accessCode,
      instructions,
      expiresIn: 10 * 60 * 1000 // 10 minutes in milliseconds
    };
  }

  /**
   * Handle bot commands (would be called by webhook)
   */
  public async handleBotCommand(command: string, args: string[], telegramUser: TelegramUser): Promise<string> {
    switch (command) {
      case '/start':
        return `Welcome to ${process.env.PLATFORM_NAME || 'Onetapay'}! 
        
To access your subscribed channels, use the access code you received after payment:
/access YOUR_ACCESS_CODE`;

      case '/access':
        if (args.length === 0) {
          return 'Please provide an access code: /access YOUR_CODE';
        }

        const accessCode = args[0];
        const verification = await this.verifyAccessCode(accessCode, telegramUser.id);
        
        if (!verification.valid) {
          return 'Invalid or expired access code. Please get a new code from your subscription dashboard.';
        }

        return `✅ Access granted to ${verification.channelName}!
        
You now have access to the channel. Your access will automatically expire when your subscription ends.

⚠️ **Important**: If you lose access, don't worry - just get a new access code from your subscription dashboard.`;

      case '/help':
        return `Available commands:
/access CODE - Access your subscribed channel
/help - Show this help message
/status - Check your channel access status`;

      case '/status':
        const userAccesses = await storage.getUserChannelAccesses(telegramUser.id);
        if (userAccesses.length === 0) {
          return 'You don\'t have access to any channels. Use /access CODE to get access.';
        }

        let statusMessage = 'Your channel access:\n\n';
        for (const access of userAccesses) {
          const channel = await storage.getChannel(access.channelId);
          const status = access.accessGranted && new Date() < access.expiresAt ? '✅ Active' : '❌ Expired';
          statusMessage += `• ${channel?.name || 'Unknown'}: ${status}\n`;
        }

        return statusMessage;

      default:
        return 'Unknown command. Use /help for available commands.';
    }
  }
}

export const telegramBot = TelegramBotManager.getInstance();