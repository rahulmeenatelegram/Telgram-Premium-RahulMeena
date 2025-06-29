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
import { Separator } from "@/components/ui/separator";
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
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  // Redirect if not admin
  if (user?.role !== "admin") {
    return <div>Access denied. Admin privileges required.</div>;
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

  const handleAddChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const channelData = {
      name: formData.get("name") as string,
      slug: (formData.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      telegramLink: formData.get("telegramLink") as string,
      memberCount: parseInt(formData.get("memberCount") as string) || 0,
      icon: formData.get("icon") as string,
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage channels, payments, and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics?.totalRevenue || 0)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.activeChannels || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics?.availableBalance || 0)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="channels" className="space-y-4">
          <TabsList>
            <TabsTrigger value="channels">Channels</TabsTrigger>
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
                    <div>
                      <Label htmlFor="icon">Icon (Font Awesome class)</Label>
                      <Input id="icon" name="icon" placeholder="fas fa-chart-line" required />
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channels?.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell className="font-medium">{channel.name}</TableCell>
                        <TableCell>{formatCurrency(parseFloat(channel.price))}</TableCell>
                        <TableCell>{channel.memberCount}</TableCell>
                        <TableCell>
                          <Badge variant={channel.isActive ? "default" : "secondary"}>
                            {channel.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteChannelMutation.mutate(channel.id)}
                            disabled={deleteChannelMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Payments</h2>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.slice(0, 10).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.email}</TableCell>
                        <TableCell>{formatCurrency(parseFloat(payment.amount))}</TableCell>
                        <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              payment.status === "success" 
                                ? "default" 
                                : payment.status === "failed" 
                                ? "destructive" 
                                : "secondary"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Withdrawal History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Requested</TableHead>
                          <TableHead>Completed</TableHead>
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
                              >
                                {withdrawal.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                            <TableCell>
                              {withdrawal.completedAt ? formatDate(withdrawal.completedAt) : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
