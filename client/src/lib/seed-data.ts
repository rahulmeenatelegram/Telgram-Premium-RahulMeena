import { createChannel } from "./firebase-service";
import type { InsertChannel } from "@shared/firebase-types";

const sampleChannels: InsertChannel[] = [
  {
    name: "Premium Trading Signals",
    slug: "premium-trading-signals",
    description: "Get exclusive trading signals from professional traders with 85% accuracy rate. Daily analysis and market insights.",
    price: 299,
    subscriptionType: "monthly",
    telegramLink: "https://t.me/+premium_trading_signals_demo",
    memberCount: 1250,
    icon: "fas fa-chart-line",
    isActive: true,
  },
  {
    name: "Crypto Investment Club",
    slug: "crypto-investment-club",
    description: "Advanced cryptocurrency investment strategies and portfolio management from industry experts.",
    price: 499,
    subscriptionType: "monthly",
    telegramLink: "https://t.me/+crypto_investment_club_demo",
    memberCount: 890,
    icon: "fab fa-bitcoin",
    isActive: true,
  },
  {
    name: "Stock Market Pro",
    slug: "stock-market-pro",
    description: "Professional stock market analysis, swing trading strategies, and market psychology insights.",
    price: 2999,
    subscriptionType: "yearly",
    telegramLink: "https://t.me/+stock_market_pro_demo",
    memberCount: 567,
    icon: "fas fa-trending-up",
    isActive: true,
  },
  {
    name: "Options Trading Mastery",
    slug: "options-trading-mastery",
    description: "Learn advanced options trading strategies and risk management techniques from certified traders.",
    price: 799,
    subscriptionType: "monthly",
    telegramLink: "https://t.me/+options_trading_mastery_demo",
    memberCount: 423,
    icon: "fas fa-cogs",
    isActive: true,
  },
];

export const seedChannels = async () => {
  console.log("Seeding channels...");
  
  for (const channel of sampleChannels) {
    try {
      await createChannel(channel);
      console.log(`Created channel: ${channel.name}`);
    } catch (error) {
      console.error(`Error creating channel ${channel.name}:`, error);
    }
  }
  
  console.log("Channel seeding completed!");
};