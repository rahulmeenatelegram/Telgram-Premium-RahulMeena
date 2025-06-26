import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, CreditCard, Smartphone, Lock } from "lucide-react";
import { Link } from "wouter";
import { Channel } from "@shared/schema";
import PaymentModal from "@/components/payment-modal";
import SuccessModal from "@/components/success-modal";

export default function PaymentPage() {
  const { channelSlug } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [accessLink, setAccessLink] = useState("");
  const [channelName, setChannelName] = useState("");

  const { data: channel, isLoading, error } = useQuery<Channel>({
    queryKey: [`/api/channels/${channelSlug}`],
    enabled: !!channelSlug,
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: { channelId: number; email: string; paymentMethod: string; subscriptionType: string }) => {
      const res = await apiRequest("POST", "/api/subscriptions/create-order", data);
      return res.json();
    },
    onSuccess: (orderData) => {
      handleRazorpayPayment(orderData);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const res = await apiRequest("POST", "/api/payments/verify", paymentData);
      return res.json();
    },
    onSuccess: (data) => {
      setAccessLink(data.accessLink);
      setChannelName(data.channelName);
      setShowSuccessModal(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRazorpayPayment = (orderData: any) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "TeleChannels",
      description: `Access to ${channel?.name}`,
      order_id: orderData.orderId,
      handler: function (response: any) {
        verifyPaymentMutation.mutate({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          paymentId: orderData.paymentId,
        });
      },
      prefill: {
        email: email,
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      theme: {
        color: "#1E40AF",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      toast({
        title: "Payment Failed",
        description: response.error.description,
        variant: "destructive",
      });
    });
    rzp.open();
  };

  const handleSubscriptionPayment = (data: { email: string; paymentMethod: "upi" | "card"; subscriptionType: string }) => {
    if (!channel) {
      toast({
        title: "Error",
        description: "Channel not found",
        variant: "destructive",
      });
      return;
    }

    createSubscriptionMutation.mutate({
      channelId: channel.id,
      email: data.email,
      paymentMethod: data.paymentMethod,
      subscriptionType: data.subscriptionType,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading channel details...</p>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-semibold mb-2">Channel Not Found</h1>
            <p className="text-gray-600 mb-4">The requested channel could not be found.</p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(amount));
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Complete Your Purchase</CardTitle>
                <CardDescription>
                  Secure payment powered by Razorpay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Channel Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className={`${channel.icon} text-blue-600 text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{channel.name}</h3>
                      <p className="text-sm text-gray-500">{channel.memberCount}+ members</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{channel.description}</p>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(channel.price)}
                  </div>
                </div>

                <Separator />

                {/* Payment Form */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send your access link to this email
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Payment Method
                    </Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value: "upi" | "card") => setPaymentMethod(value)}
                    >
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center space-x-2 cursor-pointer flex-1">
                          <Smartphone className="w-5 h-5" />
                          <span>UPI Payment</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer flex-1">
                          <CreditCard className="w-5 h-5" />
                          <span>Credit/Debit Card</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-1">
                      Your payment is secured by Razorpay with 256-bit SSL encryption
                    </p>
                  </div>

                  <Button
                    type="button"
                    className="w-full py-3 text-lg"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Subscribe Now - {formatCurrency(channel.price)}/month
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Secured by Razorpay • SSL Encrypted</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        channelName={channel.name}
        channelPrice={channel.price}
        subscriptionType={channel.subscriptionType || "monthly"}
        onPayment={handleSubscriptionPayment}
        isProcessing={createSubscriptionMutation.isPending}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        accessLink={accessLink}
        channelName={channelName}
      />

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </>
  );
}
