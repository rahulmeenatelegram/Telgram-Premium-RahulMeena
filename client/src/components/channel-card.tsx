import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Users, Star, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { Channel } from "@shared/firebase-types";

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {

  return (
    <Card className="h-full hover-lift glass border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-scale-in group overflow-hidden relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center hover-scale group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
            <span className="text-2xl filter group-hover:brightness-110 transition-all duration-300">{channel.icon}</span>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-300">
              {channel.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium">{channel.memberCount.toLocaleString()}+ members</span>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4 text-sm line-clamp-3 leading-relaxed">
          {channel.description}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {formatCurrency(channel.price)}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                per {channel.subscriptionType || 'month'}
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-background/50 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">4.8</span>
            </div>
          </div>
          
          <Button asChild className="w-full hover-glow gradient-bg border-0 font-semibold group-hover:scale-105 transition-all duration-300">
            <Link href={`/payment/${channel.slug}`}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Subscribe Now
            </Link>
          </Button>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Badge variant="outline" className="mr-1 text-xs">Auto-renew</Badge>
            </span>
            <span>•</span>
            <span>Cancel anytime</span>
            <span>•</span>
            <span>No hidden fees</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
