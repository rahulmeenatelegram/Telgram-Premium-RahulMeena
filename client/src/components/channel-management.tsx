import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { getActiveChannels, createChannel, updateChannel, deleteChannel } from "@/lib/firebase-service";
import { insertChannelSchema } from "@shared/firebase-types";
import type { Channel, InsertChannel } from "@shared/firebase-types";
import { z } from "zod";

type ChannelFormData = z.infer<typeof insertChannelSchema>;

export default function ChannelManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch channels
  const { data: channels = [], refetch: refetchChannels } = useQuery({
    queryKey: ["all-channels"],
    queryFn: getActiveChannels,
  });

  // Add channel form
  const addForm = useForm<ChannelFormData>({
    resolver: zodResolver(insertChannelSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      subscriptionType: "monthly",
      telegramLink: "",
      memberCount: 0,
      icon: "",
      isActive: true,
    },
  });

  // Edit channel form
  const editForm = useForm<ChannelFormData>({
    resolver: zodResolver(insertChannelSchema),
  });

  // Add channel mutation
  const addChannelMutation = useMutation({
    mutationFn: createChannel,
    onSuccess: () => {
      toast({
        title: "Channel Added",
        description: "Channel has been created successfully.",
      });
      setIsAddModalOpen(false);
      addForm.reset();
      refetchChannels();
      queryClient.invalidateQueries({ queryKey: ["active-channels"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create channel",
        variant: "destructive",
      });
    },
  });

  // Edit channel mutation
  const editChannelMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InsertChannel> }) => {
      return await updateChannel(id, updates);
    },
    onSuccess: () => {
      toast({
        title: "Channel Updated",
        description: "Channel has been updated successfully.",
      });
      setEditingChannel(null);
      editForm.reset();
      refetchChannels();
      queryClient.invalidateQueries({ queryKey: ["active-channels"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update channel",
        variant: "destructive",
      });
    },
  });

  // Delete channel mutation
  const deleteChannelMutation = useMutation({
    mutationFn: deleteChannel,
    onSuccess: () => {
      toast({
        title: "Channel Deleted",
        description: "Channel has been deleted successfully.",
      });
      refetchChannels();
      queryClient.invalidateQueries({ queryKey: ["active-channels"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete channel",
        variant: "destructive",
      });
    },
  });

  // Toggle channel status mutation
  const toggleChannelMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await updateChannel(id, { isActive });
    },
    onSuccess: () => {
      toast({
        title: "Channel Status Updated",
        description: "Channel visibility has been updated.",
      });
      refetchChannels();
      queryClient.invalidateQueries({ queryKey: ["active-channels"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update channel status",
        variant: "destructive",
      });
    },
  });

  const onAddChannel = (data: ChannelFormData) => {
    // Generate slug from name if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    addChannelMutation.mutate(data);
  };

  const onEditChannel = (data: ChannelFormData) => {
    if (!editingChannel) return;
    
    // Generate slug from name if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    editChannelMutation.mutate({
      id: editingChannel.id,
      updates: data,
    });
  };

  const handleEdit = (channel: Channel) => {
    setEditingChannel(channel);
    editForm.reset({
      name: channel.name,
      slug: channel.slug,
      description: channel.description,
      price: channel.price,
      subscriptionType: channel.subscriptionType,
      telegramLink: channel.telegramLink,
      memberCount: channel.memberCount || 0,
      icon: channel.icon,
      isActive: channel.isActive,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this channel? This action cannot be undone.")) {
      deleteChannelMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleChannelMutation.mutate({
      id,
      isActive: !currentStatus,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Channel Management</h2>
          <p className="text-muted-foreground">Manage your Telegram channels and subscriptions</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Channel</DialogTitle>
              <DialogDescription>
                Create a new Telegram channel for subscriptions
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddChannel)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Channel Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Premium Trading Signals" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="premium-trading-signals" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what subscribers will get..."
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={addForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="299"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="subscriptionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="memberCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member Count</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1500"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="telegramLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telegram Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://t.me/+channellink" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon/Emoji</FormLabel>
                        <FormControl>
                          <Input placeholder="📈" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addChannelMutation.isPending}>
                    {addChannelMutation.isPending ? "Creating..." : "Create Channel"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Channels Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Channels</CardTitle>
          <CardDescription>
            Manage all your Telegram channels and their settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{channel.icon}</span>
                      <div>
                        <div className="font-medium">{channel.name}</div>
                        <div className="text-sm text-muted-foreground">{channel.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(channel.price)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {channel.subscriptionType}
                    </Badge>
                  </TableCell>
                  <TableCell>{channel.memberCount?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Badge variant={channel.isActive ? "default" : "secondary"}>
                      {channel.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(channel.id, channel.isActive)}
                        disabled={toggleChannelMutation.isPending}
                      >
                        {channel.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(channel)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(channel.id)}
                        disabled={deleteChannelMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {channels.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No channels found. Create your first channel to get started.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Channel Modal */}
      <Dialog open={!!editingChannel} onOpenChange={(open) => !open && setEditingChannel(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Channel</DialogTitle>
            <DialogDescription>
              Update channel information and settings
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditChannel)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Premium Trading Signals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="premium-trading-signals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what subscribers will get..."
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="299"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="subscriptionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="memberCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Count</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1500"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="telegramLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://t.me/+channellink" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon/Emoji</FormLabel>
                      <FormControl>
                        <Input placeholder="📈" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingChannel(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editChannelMutation.isPending}>
                  {editChannelMutation.isPending ? "Updating..." : "Update Channel"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}