import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, IndianRupee, BarChart3, Wallet, Plus, Edit, Trash2 } from "lucide-react";
import { Channel, Payment, Withdrawal } from "@shared/schema";
import Navbar from "@/components/navbar";

interface Analytics {
  totalUsers: number;
  totalRevenue: number;
  availableBalance: number;
  totalWithdrawn: number;
  activeChannels: number;
  monthlyRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  successRate: number;
  recentActivity: {
    paymentsThisMonth: number;
    channelsCount: number;
    averageOrderValue: number;
    weeklyRevenue: number;
    weeklyPayments: number;
    userGrowthThisMonth: number;
    revenueGrowth: number;
    lastMonthRevenue: number;
    averageChannelPrice: number;
  };
  insights: {
    topPerformingDay: {
      date: string;
      revenue: number;
    };
    conversionRate: number;
    repeatCustomers: {
      count: number;
      percentage: number;
    };
    averageMonthlyGrowth: number;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  // Admin emails array (expandable)
  const adminEmails = ["disruptivefounder@gmail.com"];

  // Redirect if not admin - check for any email in adminEmails
  if (!user || !user.email || !adminEmails.includes(user.email)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Admin privileges required. Please contact support if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/admin/analytics"],
  });

  const { data: channels } = useQuery<Channel[]>({
    queryKey: ["/api/admin/channels"],
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: subscriptions } = useQuery<any[]>({
    queryKey: ["/api/admin/subscriptions"],
  });

  const { data: withdrawals } = useQuery<Withdrawal[]>({
    queryKey: ["/api/admin/withdrawals"],
  });

  const addChannelMutation = useMutation({
    mutationFn: async (channelData: any) => {
      const res = await apiRequest("POST", "/api/admin/channels", channelData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/channels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({
        title: "Success",
        description: "Channel created successfully",
      });
      setIsAddChannelOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteChannelMutation = useMutation({
    mutationFn: async (channelId: number) => {
      await apiRequest("DELETE", `/api/admin/channels/${channelId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/channels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({
        title: "Success",
        description: "Channel deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: async (amount: string) => {
      const res = await apiRequest("POST", "/api/admin/withdrawals", {
        amount: amount,
        status: "pending",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });
      setWithdrawalAmount("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Array of random icons for channels
  const randomIcons = [
    "📚", "🎯", "💡", "🚀", "🎨", "🔥", "⭐", "💎", "🌟", "🎪",
    "🎭", "🎨", "🎸", "🎵", "🎬", "📱", "💻", "🌈", "🔮", "⚡",
    "🎲", "🎊", "🎉", "🎀", "🎁", "🏆", "👑", "💰", "💡", "🌙"
  ];

  const handleAddChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get a random icon from the array
    const randomIcon = randomIcons[Math.floor(Math.random() * randomIcons.length)];
    
    const channelData = {
      name: formData.get("name") as string,
      slug: (formData.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      telegramLink: formData.get("telegramLink") as string,
      memberCount: parseInt(formData.get("memberCount") as string) || 0,
      icon: randomIcon,
    };

    addChannelMutation.mutate(channelData);
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    withdrawalMutation.mutate(withdrawalAmount);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDaysRemaining = (endDate: string | Date | null | undefined) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage channels, payments, and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics?.totalRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics?.monthlyRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.activeChannels || 0}</div>
              <p className="text-xs text-muted-foreground">Live channels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics?.availableBalance || 0)}</div>
              <p className="text-xs text-muted-foreground">Ready to withdraw</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Payments</span>
                <span className="font-medium">{analytics?.totalPayments || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Successful</span>
                <span className="font-medium text-green-600">{analytics?.successfulPayments || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-medium">{analytics?.successRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                <span className="font-medium">{formatCurrency(analytics?.recentActivity?.averageOrderValue || 0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payments</span>
                <span className="font-medium">{analytics?.recentActivity?.paymentsThisMonth || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-medium">{formatCurrency(analytics?.monthlyRevenue || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">New Users</span>
                <span className="font-medium">{analytics?.recentActivity?.userGrowthThisMonth || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Growth</span>
                <span className={`font-medium ${(analytics?.recentActivity?.revenueGrowth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analytics?.recentActivity?.revenueGrowth || 0) >= 0 ? '+' : ''}{analytics?.recentActivity?.revenueGrowth || 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity (7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weekly Payments</span>
                <span className="font-medium">{analytics?.recentActivity?.weeklyPayments || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weekly Revenue</span>
                <span className="font-medium">{formatCurrency(analytics?.recentActivity?.weeklyRevenue || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <span className="font-medium">{analytics?.insights?.conversionRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Channel Price</span>
                <span className="font-medium">{formatCurrency(analytics?.recentActivity?.averageChannelPrice || 0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Business Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Repeat Customers</span>
                <span className="font-medium">{analytics?.insights?.repeatCustomers?.count || 0} ({analytics?.insights?.repeatCustomers?.percentage || 0}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Growth Avg</span>
                <span className={`font-medium ${(analytics?.insights?.averageMonthlyGrowth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analytics?.insights?.averageMonthlyGrowth || 0) >= 0 ? '+' : ''}{analytics?.insights?.averageMonthlyGrowth || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Best Day Revenue</span>
                <span className="font-medium">{formatCurrency(analytics?.insights?.topPerformingDay?.revenue || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Best Day Date</span>
                <span className="font-medium text-xs">{analytics?.insights?.topPerformingDay?.date || '-'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="font-medium text-2xl">{formatCurrency(analytics?.totalRevenue || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available Balance</span>
                <span className="font-medium text-xl text-green-600">{formatCurrency(analytics?.availableBalance || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Withdrawn</span>
                <span className="font-medium text-red-600">{formatCurrency(analytics?.totalWithdrawn || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Month Revenue</span>
                <span className="font-medium">{formatCurrency(analytics?.recentActivity?.lastMonthRevenue || 0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <span className="font-medium text-2xl">{analytics?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Channels</span>
                <span className="font-medium text-xl">{analytics?.activeChannels || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Success Rate</span>
                <span className="font-medium text-green-600">{analytics?.successRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Customer Conversion</span>
                <span className="font-medium">{analytics?.insights?.conversionRate || 0}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="channels" className="space-y-4">
          <TabsList>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Channel Management</h2>
              <Dialog open={isAddChannelOpen} onOpenChange={setIsAddChannelOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Channel
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Channel</DialogTitle>
                    <DialogDescription>
                      Create a new premium Telegram channel for users to purchase.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddChannel} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Channel Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" required />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input id="price" name="price" type="number" step="0.01" required />
                    </div>
                    <div>
                      <Label htmlFor="telegramLink">Telegram Link</Label>
                      <Input id="telegramLink" name="telegramLink" placeholder="https://t.me/..." required />
                    </div>
                    <div>
                      <Label htmlFor="memberCount">Member Count</Label>
                      <Input id="memberCount" name="memberCount" type="number" defaultValue="0" />
                    </div>
                    <Button type="submit" className="w-full" disabled={addChannelMutation.isPending}>
                      {addChannelMutation.isPending ? "Creating..." : "Create Channel"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Name</TableHead>
                        <TableHead className="min-w-[80px]">Price</TableHead>
                        <TableHead className="min-w-[80px] hidden sm:table-cell">Members</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {channels?.map((channel) => (
                        <TableRow key={channel.id}>
                          <TableCell className="font-medium">{channel.name}</TableCell>
                          <TableCell>{formatCurrency(parseFloat(channel.price))}</TableCell>
                          <TableCell className="hidden sm:table-cell">{channel.memberCount}</TableCell>
                          <TableCell>
                            <Badge variant={channel.isActive ? "default" : "secondary"} className="text-xs">
                              {channel.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="space-x-1">
                            <Button size="sm" variant="outline" className="p-1">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="p-1"
                              onClick={() => deleteChannelMutation.mutate(channel.id)}
                              disabled={deleteChannelMutation.isPending}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Active Subscriptions</h2>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Email</TableHead>
                        <TableHead className="min-w-[120px]">Telegram</TableHead>
                        <TableHead className="min-w-[100px]">Channel</TableHead>
                        <TableHead className="min-w-[80px]">Amount</TableHead>
                        <TableHead className="min-w-[100px]">Days Left</TableHead>
                        <TableHead className="min-w-[90px]">Subscribed</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions?.map((subscription) => {
                        const daysLeft = calculateDaysRemaining(subscription.current_period_end);
                        return (
                          <TableRow key={subscription.id}>
                            <TableCell className="max-w-[120px] truncate">{subscription.email}</TableCell>
                            <TableCell className="max-w-[120px] truncate">@{subscription.telegram_username}</TableCell>
                            <TableCell className="max-w-[100px] truncate">{subscription.channel_name}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(subscription.amount))}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={daysLeft > 7 ? "default" : daysLeft > 0 ? "secondary" : "destructive"}
                                className="text-xs"
                              >
                                {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(subscription.current_period_start)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={subscription.status === "active" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {subscription.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Payments</h2>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Email</TableHead>
                        <TableHead className="min-w-[80px]">Amount</TableHead>
                        <TableHead className="min-w-[70px] hidden sm:table-cell">Method</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[90px] hidden md:table-cell">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments?.slice(0, 10).map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="max-w-[120px] truncate">{payment.email}</TableCell>
                          <TableCell>{formatCurrency(parseFloat(payment.amount))}</TableCell>
                          <TableCell className="capitalize hidden sm:table-cell">{payment.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                payment.status === "success" 
                                  ? "default" 
                                  : payment.status === "failed" 
                                  ? "destructive" 
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(payment.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Withdrawal History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[90px]">Amount</TableHead>
                            <TableHead className="min-w-[80px]">Status</TableHead>
                            <TableHead className="min-w-[90px] hidden sm:table-cell">Requested</TableHead>
                            <TableHead className="min-w-[90px] hidden md:table-cell">Completed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {withdrawals?.map((withdrawal) => (
                            <TableRow key={withdrawal.id}>
                              <TableCell>{formatCurrency(parseFloat(withdrawal.amount))}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    withdrawal.status === "completed" 
                                      ? "default" 
                                      : withdrawal.status === "failed" 
                                      ? "destructive" 
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {withdrawal.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">{formatDate(withdrawal.createdAt)}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {withdrawal.completedAt ? formatDate(withdrawal.completedAt) : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Request Withdrawal</CardTitle>
                    <CardDescription>
                      Available balance: {formatCurrency(analytics?.availableBalance || 0)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleWithdrawal} className="space-y-4">
                      <div>
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                          placeholder="Enter amount"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={withdrawalMutation.isPending}
                      >
                        {withdrawalMutation.isPending ? "Processing..." : "Request Withdrawal"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
