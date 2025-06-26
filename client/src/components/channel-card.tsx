import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Channel } from "@shared/schema";

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(amount));
  };

  const getIconColor = (icon: string) => {
    if (icon.includes("chart")) return "text-green-600 bg-green-100";
    if (icon.includes("graduation")) return "text-purple-600 bg-purple-100";
    if (icon.includes("rocket")) return "text-blue-600 bg-blue-100";
    if (icon.includes("dollar") || icon.includes("rupee")) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(channel.icon)}`}>
            <i className={`${channel.icon} text-xl`}></i>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">{channel.name}</h3>
            <p className="text-sm text-gray-500">{channel.memberCount}+ members</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {channel.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(channel.price)}
              </div>
              <div className="text-sm text-gray-500">
                per {channel.subscriptionType || 'month'}
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Auto-renew
            </Badge>
          </div>
          
          <Button asChild className="w-full">
            <Link href={`/payment/${channel.slug}`}>
              Subscribe Now
            </Link>
          </Button>
          
          <p className="text-xs text-gray-400 text-center">
            Cancel anytime • No hidden fees
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
