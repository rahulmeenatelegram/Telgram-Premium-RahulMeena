import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { Calendar, ExternalLink, AlertTriangle, CheckCircle, Clock, CreditCard, Zap, Mail } from "lucide-react";
import Navbar from "@/components/navbar";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";
import ChannelCard from "@/components/channel-card";
import { format } from "date-fns";

interface Channel {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  slug: string;
  is_active: boolean;
}

export default function Dashboard() {
  const { user, resendEmailVerification } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch available channels
  const { data: channels = [], isLoading: channelsLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
    enabled: !!user?.emailVerified,
  });

  // Mock data for Firebase user subscriptions (since we don't have backend user sync yet)
  const mockSubscriptions = [
    {
      id: 1,
      channel_name: "Premium Trading Signals",
      status: "active",
      expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      access_token: "abc123xyz789", // Access portal token instead of direct link
      subscription_type: "monthly",
      next_billing_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      manual_renewal_required: true,
    }
  ];

  const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active');
  const expiringSoon = mockSubscriptions.filter(sub => {
    const daysUntilExpiry = Math.ceil((new Date(sub.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && sub.status === 'active';
  });

  if (!user) {
    return null;
  }

  if (!user.emailVerified) {
    return (
      <div className="min-h-screen relative">
        <BackgroundGlow />
        <FloatingParticles />
        <Navbar />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-16 px-4">
          <Card className="w-full max-w-md glass-effect border-white/5">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-yellow-500" />
              </div>
              <CardTitle className="text-xl font-light">Email Verification Required</CardTitle>
              <CardDescription className="font-light">
                Please verify your email address to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="glass-effect border-yellow-500/20 bg-yellow-500/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  We sent a verification link to <strong>{user.email}</strong>. Please check your inbox and click the link to verify your account.
                </AlertDescription>
              </Alert>
              <Button
                onClick={resendEmailVerification}
                className="w-full bg-white text-black hover:bg-white/90 font-medium"
              >
                Resend Verification Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <BackgroundGlow />
      <FloatingParticles />
      <Navbar />
      
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2 sm:mb-4">
              Welcome back, <span className="text-primary">{user.email?.split('@')[0]}</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-light">
              Manage your subscriptions and discover new premium channels
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
            <TabsList className="grid w-full grid-cols-3 glass-effect bg-white/5">
              <TabsTrigger value="overview" className="font-light data-[state=active]:bg-white data-[state=active]:text-black">
                Overview
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="font-light data-[state=active]:bg-white data-[state=active]:text-black">
                My Subscriptions
              </TabsTrigger>
              <TabsTrigger value="explore" className="font-light data-[state=active]:bg-white data-[state=active]:text-black">
                Explore Channels
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 sm:space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="glass-effect border-white/5">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-light">{activeSubscriptions.length}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Active Subscriptions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-white/5">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-light">{channels.length}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Available Channels</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-white/5">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-light">{expiringSoon.length}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Expiring Soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-white/5">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-light">₹{activeSubscriptions.length * 199}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Monthly Spend</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="glass-effect border-white/5">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-light">Quick Actions</CardTitle>
                  <CardDescription className="font-light">
                    Common tasks to manage your subscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="glass-effect border-white/10 hover:border-white/20 font-light justify-start"
                      onClick={() => setActiveTab("explore")}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Browse Channels
                    </Button>
                    <Button
                      variant="outline"
                      className="glass-effect border-white/10 hover:border-white/20 font-light justify-start"
                      onClick={() => setActiveTab("subscriptions")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Subscriptions
                    </Button>
                    <Button
                      variant="outline"
                      className="glass-effect border-white/10 hover:border-white/20 font-light justify-start"
                      asChild
                    >
                      <Link href="/contact">
                        <Mail className="mr-2 h-4 w-4" />
                        Get Support
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Renewal Notice */}
              <Alert className="glass-effect border-blue-500/20 bg-blue-500/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Manual Renewal Policy:</strong> All subscriptions require manual renewal every 30 days. 
                  You'll receive reminders 7 days before expiry and have a 3-day grace period after expiration.
                </AlertDescription>
              </Alert>

              {/* Expiring Soon Alert */}
              {expiringSoon.length > 0 && (
                <Alert className="glass-effect border-yellow-500/20 bg-yellow-500/5">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You have {expiringSoon.length} subscription{expiringSoon.length > 1 ? 's' : ''} expiring soon. 
                    <Button variant="link" className="p-0 ml-2 h-auto text-yellow-600 hover:text-yellow-500" onClick={() => setActiveTab("subscriptions")}>
                      View details
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-light mb-4">My Subscriptions</h2>
                  <p className="text-sm sm:text-base text-muted-foreground font-light mb-6">
                    Manage your active subscriptions and access links
                  </p>
                </div>

                {activeSubscriptions.length === 0 ? (
                  <Card className="glass-effect border-white/5">
                    <CardContent className="p-8 sm:p-12 text-center">
                      <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Active Subscriptions</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Start your journey by subscribing to premium channels
                      </p>
                      <Button 
                        className="bg-white text-black hover:bg-white/90 font-medium"
                        onClick={() => setActiveTab("explore")}
                      >
                        Browse Channels
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeSubscriptions.map((subscription) => {
                      const daysUntilExpiry = Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      const isExpiringSoon = daysUntilExpiry <= 7;

                      return (
                        <Card key={subscription.id} className="glass-effect border-white/5">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg font-light">{subscription.channel_name}</CardTitle>
                                <CardDescription className="font-light">
                                  {subscription.subscription_type} subscription
                                </CardDescription>
                              </div>
                              <Badge 
                                variant={subscription.status === 'active' ? 'default' : 'secondary'}
                                className="glass-effect border-white/10"
                              >
                                {subscription.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground mb-1">Expires on</p>
                                <p className="font-medium flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {format(new Date(subscription.expires_at), 'MMM dd, yyyy')}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">Next billing</p>
                                <p className="font-medium">
                                  {format(new Date(subscription.next_billing_date), 'MMM dd, yyyy')}
                                </p>
                              </div>
                            </div>

                            {isExpiringSoon && (
                              <Alert className="glass-effect border-yellow-500/20 bg-yellow-500/5">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                  Expires in {daysUntilExpiry} day{daysUntilExpiry > 1 ? 's' : ''}
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 glass-effect border-white/10 hover:border-white/20 font-light"
                                asChild
                              >
                                <Link href={`/access/${subscription.access_token}`}>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Access Portal
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="glass-effect border-white/10 hover:border-white/20 font-light"
                              >
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="explore" className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-light mb-4">Explore Channels</h2>
                <p className="text-sm sm:text-base text-muted-foreground font-light mb-6">
                  Discover premium Telegram channels curated for you
                </p>
              </div>

              {channelsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-effect border-white/5 rounded-xl h-64 animate-pulse" />
                  ))}
                </div>
              ) : channels.length === 0 ? (
                <Card className="glass-effect border-white/5">
                  <CardContent className="p-8 sm:p-12 text-center">
                    <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Channels Available</h3>
                    <p className="text-sm text-muted-foreground">
                      New channels are being added soon. Check back later!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {channels.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}