import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "wouter";
import { Calendar, ExternalLink, AlertTriangle, CreditCard, Clock, RefreshCw } from "lucide-react";
import Navbar from "@/components/navbar";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";
import PaymentModal from "@/components/payment-modal";
import SuccessModal from "@/components/success-modal";
import { format } from "date-fns";

interface AccessPortalData {
  subscription: {
    id: number;
    channel_name: string;
    status: string;
    current_period_end: string;
    access_blocked: boolean;
    grace_period_days: number;
    telegram_invite_link?: string;
  };
  access_granted: boolean;
  days_until_expiry: number;
  renewal_required: boolean;
}

export default function AccessPortal() {
  const [location] = useLocation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Extract access token from URL
  const accessToken = location.split('/access/')[1];

  // If no access token, show error immediately
  if (!accessToken || accessToken === 'undefined') {
    return (
      <div className="min-h-screen relative">
        <BackgroundGlow />
        <FloatingParticles />
        <Navbar />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-16 px-4">
          <Card className="w-full max-w-md glass-effect border-red-500/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-xl font-light">Access Denied</CardTitle>
              <CardDescription className="font-light">
                No access token provided
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-black hover:bg-white/90 font-medium"
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { data: accessData, isLoading, error, refetch } = useQuery<AccessPortalData>({
    queryKey: ["/api/access-portal", accessToken],
    queryFn: () => fetch(`/api/access-portal/${accessToken}`).then(res => res.json()),
    enabled: !!accessToken,
  });

  const handleRenewal = async (paymentData: any) => {
    setIsProcessing(true);
    try {
      // Create renewal payment
      const response = await fetch("/api/create-renewal-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          payment_method: paymentData.paymentMethod,
          email: paymentData.email
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle Razorpay payment flow here
        setShowPaymentModal(false);
        setShowSuccessModal(true);
        refetch();
      }
    } catch (error) {
      console.error("Renewal error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <BackgroundGlow />
        <FloatingParticles />
        <Navbar />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-16 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !accessData) {
    return (
      <div className="min-h-screen relative">
        <BackgroundGlow />
        <FloatingParticles />
        <Navbar />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-16 px-4">
          <Card className="w-full max-w-md glass-effect border-red-500/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-xl font-light">Access Denied</CardTitle>
              <CardDescription className="font-light">
                Invalid or expired access token
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-black hover:bg-white/90 font-medium"
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { subscription, access_granted, days_until_expiry, renewal_required } = accessData;
  
  // Add safety checks for subscription data
  if (!subscription) {
    return (
      <div className="min-h-screen relative">
        <BackgroundGlow />
        <FloatingParticles />
        <Navbar />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-16 px-4">
          <Card className="w-full max-w-md glass-effect border-red-500/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-xl font-light">Access Denied</CardTitle>
              <CardDescription className="font-light">
                Invalid subscription data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-black hover:bg-white/90 font-medium"
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const isExpired = subscription.status === 'expired';
  const isNearExpiry = days_until_expiry <= 7;

  return (
    <div className="min-h-screen relative">
      <BackgroundGlow />
      <FloatingParticles />
      <Navbar />
      
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4">
              Channel Access Portal
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-light">
              {subscription.channel_name}
            </p>
          </div>

          <div className="space-y-6">
            {/* Subscription Status */}
            <Card className="glass-effect border-white/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-light">Subscription Status</CardTitle>
                  <Badge 
                    variant={subscription.status === 'active' ? 'default' : 
                            subscription.status === 'expired' ? 'destructive' : 'secondary'}
                    className="glass-effect border-white/10"
                  >
                    {subscription.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Current Period Ends</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {subscription.current_period_end && !isNaN(new Date(subscription.current_period_end).getTime())
                        ? format(new Date(subscription.current_period_end), 'MMM dd, yyyy')
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Days Remaining</p>
                    <p className="font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {days_until_expiry > 0 ? `${days_until_expiry} days` : 'Expired'}
                    </p>
                  </div>
                </div>

                {/* Renewal Warning */}
                {(isNearExpiry || isExpired || renewal_required) && (
                  <Alert className={`glass-effect ${isExpired ? 'border-red-500/20 bg-red-500/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {isExpired 
                        ? 'Your subscription has expired. Renew now to continue accessing the channel.'
                        : renewal_required
                        ? 'Manual renewal required to continue your subscription.'
                        : `Your subscription expires in ${days_until_expiry} days. Renew now to avoid interruption.`
                      }
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Access Section */}
            <Card className="glass-effect border-white/5">
              <CardHeader>
                <CardTitle className="text-lg font-light">Channel Access</CardTitle>
                <CardDescription className="font-light">
                  {access_granted 
                    ? 'Click below to join the Telegram channel'
                    : 'Access blocked - renewal required'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {access_granted && subscription.telegram_invite_link ? (
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
                    asChild
                  >
                    <a 
                      href={subscription.telegram_invite_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join Telegram Channel
                    </a>
                  </Button>
                ) : (
                  <div className="text-center p-6 border border-dashed border-white/20 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Channel access is currently blocked
                    </p>
                  </div>
                )}

                {(renewal_required || isExpired || isNearExpiry) && (
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-white text-black hover:bg-white/90 font-medium"
                    disabled={isProcessing}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Renew Subscription (₹{subscription.status === 'expired' ? '199' : '199'})
                  </Button>
                )}
              </CardContent>
            </Card>

  
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        channelName={subscription.channel_name}
        channelPrice="199"
        subscriptionType="monthly"
        onPayment={handleRenewal}
        isProcessing={isProcessing}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        accessLink={`/access/${accessToken}`}
        channelName={subscription.channel_name}
        isSubscription={true}
        nextBillingDate={format(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
          'MMM dd, yyyy'
        )}
      />
    </div>
  );
}