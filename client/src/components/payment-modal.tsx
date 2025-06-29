import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, CreditCard, Smartphone, X, RefreshCw, Clock } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  channelPrice: number;
  subscriptionType?: string;
  onPayment: (data: { email: string; paymentMethod: "upi" | "card"; subscriptionType: string }) => void;
  isProcessing?: boolean;
}

export default function PaymentModal({
  isOpen,
  onClose,
  channelName,
  channelPrice,
  subscriptionType = "monthly",
  onPayment,
  isProcessing = false,
}: PaymentModalProps) {
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState(subscriptionType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPayment({ email, paymentMethod, subscriptionType: selectedSubscriptionType });
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Complete Payment</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Secure payment for premium channel access
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Channel Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{channelName}</h4>
              <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                Auto-renew
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-primary">{formatCurrency(channelPrice)}</p>
              <span className="text-sm text-gray-500">per {selectedSubscriptionType}</span>
            </div>
          </div>

          {/* Subscription Type Selector */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Billing Period
            </Label>
            <RadioGroup
              value={selectedSubscriptionType}
              onValueChange={setSelectedSubscriptionType}
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="flex items-center justify-between cursor-pointer flex-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Monthly</span>
                  </div>
                  <span className="text-sm text-gray-500">{formatCurrency(channelPrice)}/month</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly" className="flex items-center justify-between cursor-pointer flex-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Yearly</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">Save 16%</Badge>
                  </div>
                  <span className="text-sm text-gray-500">{formatCurrency(Math.round(channelPrice * 12 * 0.84))}/year</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Email Input */}
          <div>
            <Label htmlFor="modal-email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="modal-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Access details will be sent to this email
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-sm font-medium">Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value: "upi" | "card") => setPaymentMethod(value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="upi" id="modal-upi" />
                <Label htmlFor="modal-upi" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <Smartphone className="w-4 h-4 text-green-600" />
                  <span>UPI Payment</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="card" id="modal-card" />
                <Label htmlFor="modal-card" className="flex items-center space-x-2 cursor-pointer flex-1">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-blue-800">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-blue-700 text-xs mt-1">
              256-bit SSL encryption by Razorpay
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing || !email}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(selectedSubscriptionType === 'yearly' ? Math.round(channelPrice * 12 * 0.84) : channelPrice)}`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}