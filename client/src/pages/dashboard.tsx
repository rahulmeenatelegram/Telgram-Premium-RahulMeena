import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";
import Navbar from "@/components/navbar";
import { Link } from "wouter";
import { Calendar, Clock, AlertTriangle, ExternalLink, CreditCard, Bell, Zap, ArrowUpRight } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Channel } from "@shared/schema";

interface Subscription {
  id: number;
  channelId: number;
  channelName: string;
  channelSlug: string;
  accessLink: string;
  status: 'active' | 'cancelled' | 'expired';
  billingPeriod: 'monthly' | 'yearly';
  price: string;
  nextBillingDate: string;
  createdAt: string;
  autopayEnabled: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery<Subscription[]>({
    queryKey: ["/api/user/subscriptions"],
    enabled: !!user,
  });

  const { data: channels, isLoading: channelsLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      const response = await apiRequest(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscriptions"] });
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });

  const activeSubscriptions = subscriptions?.filter(sub => sub.status === 'active') || [];
  const expiringSubscriptions = activeSubscriptions.filter(sub => {
    const daysUntilBilling = differenceInDays(parseISO(sub.nextBillingDate), new Date());
    return daysUntilBilling <= 3;
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(amount));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden">
      <BackgroundGlow />
      <FloatingParticles />
      <Navbar />
      
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-2">
              Welcome back, <span className="gradient-text">{user.email.split('@')[0]}</span>
            </h1>
            <p className="text-muted-foreground font-light">
              Manage your subscriptions and access your premium channels
            </p>
          </div>

          {/* Notifications */}
          {expiringSubscriptions.length > 0 && (
            <Alert className="mb-8 glass-effect border-yellow-500/20 bg-yellow-500/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {expiringSubscriptions.length} subscription{expiringSubscriptions.length > 1 ? 's' : ''} 
                {expiringSubscriptions.length === 1 ? ' expires' : ' expire'} soon. 
                Ensure your payment method is updated to avoid service interruption.
              </AlertDescription>
            </Alert>
          )}

          {subscriptionsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="glass-effect border-white/5 animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-white/5 rounded mb-2" />
                    <div className="h-4 bg-white/5 rounded w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-white/5 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : subscriptions?.length === 0 ? (
            <Card className="glass-effect border-white/5 text-center p-8">
              <CardContent className="pt-0">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No subscriptions yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start your journey with premium Telegram channels
                </p>
                <Button asChild className="bg-white text-black hover:bg-white/90">
                  <Link href="/">Browse Channels</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Active Subscriptions */}
              <div>
                <h2 className="text-xl font-medium mb-4">Active Subscriptions</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeSubscriptions.map((subscription) => {
                    const daysUntilBilling = differenceInDays(parseISO(subscription.nextBillingDate), new Date());
                    const isExpiringSoon = daysUntilBilling <= 3;
                    
                    return (
                      <Card key={subscription.id} className="glass-effect border-white/5 hover:border-white/10 transition-colors">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">
                              {subscription.channelName}
                            </CardTitle>
                            <Badge 
                              variant={isExpiringSoon ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {subscription.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CreditCard className="h-4 w-4 mr-2" />
                            {formatCurrency(subscription.price)} / {subscription.billingPeriod}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Next billing:</span>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span className={isExpiringSoon ? "text-yellow-500" : ""}>
                                  {format(parseISO(subscription.nextBillingDate), 'MMM dd, yyyy')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Autopay:</span>
                              <Badge variant={subscription.autopayEnabled ? "secondary" : "outline"} className="text-xs">
                                {subscription.autopayEnabled ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                            {isExpiringSoon && (
                              <div className="flex items-center text-yellow-500 text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Expires in {daysUntilBilling} day{daysUntilBilling !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                          
                          <Separator className="bg-white/5" />
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 glass-effect border-white/10 hover:border-white/20"
                              asChild
                            >
                              <a href={subscription.accessLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                Access Channel
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              onClick={() => cancelSubscriptionMutation.mutate(subscription.id)}
                              disabled={cancelSubscriptionMutation.isPending}
                            >
                              {cancelSubscriptionMutation.isPending ? "Cancelling..." : "Cancel"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Expired/Cancelled Subscriptions */}
              {subscriptions?.filter(sub => sub.status !== 'active').length > 0 && (
                <div>
                  <h2 className="text-xl font-medium mb-4">Past Subscriptions</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {subscriptions.filter(sub => sub.status !== 'active').map((subscription) => (
                      <Card key={subscription.id} className="glass-effect border-white/5 opacity-60">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">
                              {subscription.channelName}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {subscription.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Ended on {format(parseISO(subscription.nextBillingDate), 'MMM dd, yyyy')}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full glass-effect border-white/10 hover:border-white/20"
                            asChild
                          >
                            <Link href={`/payment?channel=${subscription.channelSlug}`}>
                              Resubscribe
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* All Available Channels */}
          <div className="mt-12">
            <h2 className="text-xl font-medium mb-4">Available Channels</h2>
            {channelsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="glass-effect border-white/5 animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-white/5 rounded mb-2" />
                      <div className="h-4 bg-white/5 rounded w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-white/5 rounded mb-4" />
                      <div className="h-8 bg-white/5 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {channels?.map((channel) => {
                  const isSubscribed = activeSubscriptions.some(sub => sub.channelId === channel.id);
                  
                  return (
                    <Card key={channel.id} className="glass-effect border-white/5 hover:border-white/10 transition-all group">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <Badge variant="secondary" className="text-xs font-light">
                            ₹{channel.price}/mo
                          </Badge>
                        </div>
                        
                        <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                          {channel.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
                          {channel.description}
                        </p>
                        
                        {isSubscribed ? (
                          <Button 
                            variant="outline" 
                            className="w-full glass-effect border-green-500/20 bg-green-500/5 text-green-400 hover:border-green-500/30"
                            disabled
                          >
                            <ExternalLink className="mr-2 w-4 h-4" />
                            Subscribed
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full glass-effect border-white/10 hover:border-white/20 font-light group"
                            asChild
                          >
                            <Link href={`/payment?channel=${channel.slug}`}>
                              Subscribe Now
                              <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}