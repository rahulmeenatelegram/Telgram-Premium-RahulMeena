import { db } from "./firebase";
import { ref, get, set } from "firebase/database";

export async function initializeFirebaseCollections() {
  try {
    console.log("Initializing Firebase collections...");
    
    // Initialize admin wallet if it doesn't exist (production ready)
    const walletRef = ref(db, "adminWallet/main");
    const walletSnapshot = await get(walletRef);
    
    if (!walletSnapshot.exists()) {
      await set(walletRef, {
        id: "main",
        balance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        updatedAt: new Date().getTime(),
      });
      console.log("Admin wallet initialized");
    }

    console.log("Firebase collections initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase collections:", error);
  }
}