import { createChannel } from "./firebase-service";

// Seed data for testing the Firebase-based platform
export async function seedTestData() {
  try {
    // Create test channels
    const testChannels = [
      {
        name: "Premium Trading Signals",
        slug: "premium-trading",
        description: "Get exclusive trading signals and market analysis from expert traders. Join our community of successful traders!",
        price: 299,
        subscriptionType: "monthly" as const,
        telegramLink: "https://t.me/+testlink1",
        memberCount: 1500,
        icon: "📈",
        isActive: true,
      },
      {
        name: "Crypto News VIP",
        slug: "crypto-news-vip",
        description: "Breaking crypto news, insider information, and market updates before anyone else.",
        price: 499,
        subscriptionType: "monthly" as const,
        telegramLink: "https://t.me/+testlink2",
        memberCount: 2300,
        icon: "🚀",
        isActive: true,
      },
      {
        name: "Stock Market Mastery",
        slug: "stock-mastery",
        description: "Learn advanced stock trading strategies and get daily market insights from professionals.",
        price: 1999,
        subscriptionType: "yearly" as const,
        telegramLink: "https://t.me/+testlink3",
        memberCount: 850,
        icon: "💹",
        isActive: true,
      },
    ];

    // Create channels (only if running in browser and user is authenticated)
    if (typeof window !== "undefined") {
      for (const channelData of testChannels) {
        try {
          await createChannel(channelData);
          console.log(`Created test channel: ${channelData.name}`);
        } catch (error) {
          console.log(`Channel ${channelData.name} may already exist:`, error);
        }
      }
    }

    console.log("Test data seeding completed!");
  } catch (error) {
    console.error("Error seeding test data:", error);
  }
}

// Auto-seed data on first load for demo purposes
if (typeof window !== "undefined") {
  // Run seeding after a short delay to ensure Firebase is initialized
  setTimeout(() => {
    seedTestData();
  }, 2000);
}