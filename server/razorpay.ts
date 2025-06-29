import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface PayoutRequest {
  amount: number; // Amount in paise (1 rupee = 100 paise)
  currency: string;
  mode: "UPI" | "IMPS" | "NEFT" | "RTGS";
  purpose: "payout";
  fund_account: {
    account_type: "bank_account" | "vpa";
    bank_account?: {
      name: string;
      ifsc: string;
      account_number: string;
    };
    vpa?: {
      address: string;
    };
    contact: {
      name: string;
      email: string;
      contact: string;
      type: "employee";
      reference_id: string;
    };
  };
  queue_if_low_balance?: boolean;
  reference_id: string;
  narration: string;
}

export interface PayoutResponse {
  id: string;
  entity: string;
  fund_account_id: string;
  amount: number;
  currency: string;
  notes: any;
  fees: number;
  tax: number;
  status: "queued" | "pending" | "processing" | "processed" | "cancelled" | "reversed";
  purpose: string;
  utr: string | null;
  mode: string;
  reference_id: string;
  narration: string;
  batch_id: string | null;
  failure_reason: string | null;
  created_at: number;
}

export class RazorpayPayoutService {
  static async makePayoutRequest(url: string, data: any) {
    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
    
    const response = await fetch(`https://api.razorpay.com/v1/${url}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.description || 'Razorpay API error');
    }

    return await response.json();
  }

  static async createContact(name: string, email: string, contact: string, referenceId: string) {
    try {
      const contactData = {
        name,
        email,
        contact,
        type: "employee",
        reference_id: referenceId,
      };

      const response = await this.makePayoutRequest('contacts', contactData);
      return response;
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  }

  static async createFundAccount(contactId: string, accountType: "bank_account" | "vpa", accountDetails: any) {
    try {
      const fundAccountData: any = {
        contact_id: contactId,
        account_type: accountType,
      };

      if (accountType === "bank_account") {
        fundAccountData.bank_account = {
          name: accountDetails.accountHolderName,
          ifsc: accountDetails.ifsc,
          account_number: accountDetails.accountNumber,
        };
      } else if (accountType === "vpa") {
        fundAccountData.vpa = {
          address: accountDetails.upiId,
        };
      }

      const response = await this.makePayoutRequest('fund_accounts', fundAccountData);
      return response;
    } catch (error) {
      console.error("Error creating fund account:", error);
      throw error;
    }
  }

  static async createPayout(payoutData: any): Promise<PayoutResponse> {
    try {
      const response = await this.makePayoutRequest('payouts', payoutData);
      return response as PayoutResponse;
    } catch (error) {
      console.error("Error creating payout:", error);
      throw error;
    }
  }

  static async processInstantWithdrawal(
    amount: number,
    withdrawalMethod: "bank_account" | "upi",
    accountDetails: any,
    adminEmail: string,
    referenceId: string
  ): Promise<{ success: boolean; payoutId?: string; error?: string; utr?: string }> {
    try {
      // Convert amount from rupees to paise
      const amountInPaise = Math.round(amount * 100);

      // Create or get contact
      const contact = await this.createContact(
        "Admin User",
        adminEmail,
        "9999999999", // Default contact number
        `admin_${referenceId}`
      );

      // Create fund account
      const accountType = withdrawalMethod === "upi" ? "vpa" : "bank_account";
      const fundAccount = await this.createFundAccount(
        contact.id,
        accountType,
        accountDetails
      );

      // Create payout request
      const payoutData = {
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER || "2323230099089860", // Your Razorpay account
        fund_account_id: fundAccount.id,
        amount: amountInPaise,
        currency: "INR",
        mode: withdrawalMethod === "upi" ? "UPI" : "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: referenceId,
        narration: `TeleChannels Admin Withdrawal - ${referenceId}`,
      };

      const payout = await this.createPayout(payoutData);

      return {
        success: true,
        payoutId: payout.id,
        utr: payout.utr || undefined,
      };
    } catch (error: any) {
      console.error("Razorpay payout error:", error);
      return {
        success: false,
        error: error.message || "Payout failed",
      };
    }
  }

  static async getPayoutStatus(payoutId: string): Promise<PayoutResponse> {
    try {
      const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
      
      const response = await fetch(`https://api.razorpay.com/v1/payouts/${payoutId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payout status');
      }

      return await response.json() as PayoutResponse;
    } catch (error) {
      console.error("Error fetching payout status:", error);
      throw error;
    }
  }
}