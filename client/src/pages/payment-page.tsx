import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, CreditCard, Smartphone, Lock, Users, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Channel } from "@shared/schema";
import PaymentModal from "@/components/payment-modal";
import SuccessModal from "@/components/success-modal";

export default function PaymentPage() {
  const [, params] = useRoute("/payment/:slug?");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [telegramUsername, setTelegramUsername] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [subscriptionType, setSubscriptionType] = useState("monthly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [accessLink, setAccessLink] = useState("");
  const [channelName, setChannelName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // Get channel slug from URL params or route params
  const channelSlug = params?.slug || new URLSearchParams(window.location.search).get('channel');

  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  useEffect(() => {
    if (channels && channelSlug) {
      const channel = channels.find(c => c.slug === channelSlug);
      if (channel) {
        setSelectedChannel(channel);
        setChannelName(channel.name);
      }
    }
  }, [channels, channelSlug]);

  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: { 
      channelId: number; 
      telegramUsername: string;
      paymentMethod: string; 
      subscriptionType: string 
    }) => {
      const res = await apiRequest("POST", "/api/subscriptions/create-order", data);
      return res.json();
    },
    onSuccess: (orderData) => {
      // Store the access link from the response for later display
      if (orderData.accessLink) {
        setAccessLink(orderData.accessLink);
      }
      handleRazorpayPayment(orderData);
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRazorpayPayment = (orderData: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "TeleChannels",
      description: `Subscription to ${selectedChannel?.name}`,
      order_id: orderData.razorpay_order_id,
      handler: function (response: any) {
        verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          subscriptionId: orderData.subscriptionId
        });
      },
      prefill: {
        email: telegramUsername || `user_${Date.now()}`,
      },
      theme: {
        color: "#8b5cf6"
      },
      modal: {
        ondismiss: function() {
          toast({
            title: "Payment Cancelled",
            description: "Your payment was cancelled. You can try again anytime.",
            variant: "destructive",
          });
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const verifyPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/subscriptions/verify-payment", data);
      return res.json();
    },
    onSuccess: (data) => {
      setAccessLink(data.accessLink);
      setShowSuccessModal(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyPayment = (data: any) => {
    verifyPaymentMutation.mutate(data);
  };

  const handleSubscribe = () => {
    if (!selectedChannel) {
      toast({
        title: "Missing Information",
        description: "Please select a channel",
        variant: "destructive",
      });
      return;
    }

    // Validate that Telegram username is provided
    if (!telegramUsername) {
      toast({
        title: "Telegram Username Required",
        description: "Please provide your Telegram username for channel access",
        variant: "destructive",
      });
      return;
    }

    createSubscriptionMutation.mutate({
      channelId: selectedChannel.id,
      telegramUsername,
      paymentMethod,
      subscriptionType
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/5 rounded w-48 mx-auto mb-4" />
            <div className="h-4 bg-white/5 rounded w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedChannel) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-light mb-4">Channel not found</h1>
          <p className="text-muted-foreground mb-8">The channel you're looking for doesn't exist.</p>
          <Link href="/">
            <Button variant="outline" className="glass-effect border-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const monthlyPrice = parseFloat(selectedChannel.price);
  const yearlyPrice = monthlyPrice * 10; // 2 months free
  const currentPrice = subscriptionType === "monthly" ? monthlyPrice : yearlyPrice;

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-sm font-light">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Channels
            </Button>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-extralight tracking-tight mb-4">
            subscribe to <span className="gradient-text">{selectedChannel.name}</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl">
            Join thousands of professionals accessing premium content
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Channel Info */}
          <div className="space-y-8">
            <Card className="glass-effect border-white/10 rounded-3xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">{selectedChannel.name}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {selectedChannel.description}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    Members
                  </div>
                  <div className="font-medium">{selectedChannel.memberCount?.toLocaleString()}</div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Status
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                    Active
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card className="glass-effect border-white/10 rounded-3xl p-8">
              <h4 className="text-lg font-medium mb-6">What's included</h4>
              <div className="space-y-4">
                {[
                  "24/7 access to premium content",
                  "Real-time notifications",
                  "Cancel anytime",
                  "Mobile app access"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-light">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-8">
            <Card className="glass-effect border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-medium mb-6">Subscription Details</h3>
              
              {/* Subscription Type */}
              <div className="space-y-4 mb-6">
                <Label className="text-sm font-light">Billing Period</Label>
                <RadioGroup value={subscriptionType} onValueChange={setSubscriptionType}>
                  <div className="flex items-center space-x-3 p-4 rounded-xl glass-effect border border-white/5">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Monthly</div>
                          <div className="text-sm text-muted-foreground">Billed monthly</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{monthlyPrice}</div>
                          <div className="text-sm text-muted-foreground">/month</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 rounded-xl glass-effect border border-white/5">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Yearly</div>
                          <div className="text-sm text-muted-foreground">2 months free</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{yearlyPrice}</div>
                          <div className="text-sm text-muted-foreground">/year</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Telegram Username */}
              <div className="space-y-4 mb-6">
                <Label className="text-sm font-light">Telegram Username</Label>
                <p className="text-xs text-muted-foreground">Enter your Telegram username for channel access</p>
                
                <div className="space-y-2">
                  <Input
                    id="telegramUsername"
                    type="text"
                    placeholder="@yourusername"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="glass-effect border-white/10 focus:border-white/20 rounded-xl h-12"
                    required
                  />
                </div>
                
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-300">
                    <strong>How to find your username:</strong><br/>
                    Go to Telegram Settings → Edit Profile → Username
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 mb-8">
                <Label className="text-sm font-light">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={(value: "upi" | "card") => setPaymentMethod(value)}>
                  <div className="flex items-center space-x-3 p-4 rounded-xl glass-effect border border-white/5">
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="upi" className="cursor-pointer">UPI</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 rounded-xl glass-effect border border-white/5">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Total */}
              <div className="p-6 rounded-2xl glass-effect border border-white/5 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Subscription ({subscriptionType})</span>
                  <span className="font-medium">₹{currentPrice}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-medium pt-2 border-t border-white/5">
                  <span>Total</span>
                  <span>₹{currentPrice}</span>
                </div>
              </div>

              {/* Subscribe Button */}
              <Button
                onClick={handleSubscribe}
                disabled={!telegramUsername || createSubscriptionMutation.isPending}
                className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl font-medium group"
              >
                {createSubscriptionMutation.isPending ? "Processing..." : "Subscribe Now"}
                <Lock className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4 font-light">
                Secure payment powered by Razorpay. Cancel anytime.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        channelName={channelName}
        channelPrice={currentPrice.toString()}
        subscriptionType={subscriptionType}
        onPayment={handleSubscribe}
        isProcessing={createSubscriptionMutation.isPending}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        accessLink={accessLink}
        channelName={channelName}
        isSubscription={true}
      />
    </div>
  );
}