import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Zap, Star, ArrowUpRight } from "lucide-react";
import { BackgroundGlow } from "@/components/background-effects";
import type { Channel } from "@shared/schema";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const featuredChannels = channels?.slice(0, 3) || [];

  return (
    <div className="min-h-screen relative">
      <BackgroundGlow />
      
      {/* Mouse follower */}
      <div 
        className="fixed w-6 h-6 border border-white/20 rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out mix-blend-difference"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${isVisible ? 1 : 0})`,
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.03)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-6 sm:mb-8">
              <Badge variant="outline" className="glass-effect border-white/10 text-xs sm:text-sm font-light px-3 sm:px-4 py-1.5 sm:py-2">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1.5 sm:mr-2" />
                Premium Telegram Access
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extralight tracking-tight mb-6 sm:mb-8 leading-[0.9]">
              <span className="block">unlock</span>
              <span className="block gradient-text">premium</span>
              <span className="block">channels</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2 sm:px-0">
              Access exclusive telegram channels with recurring subscriptions. 
              Professional content, delivered seamlessly.
            </p>
            
            <div className="flex justify-center items-center mb-12 sm:mb-16">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium rounded-full group w-full sm:w-auto max-w-xs"
                asChild
              >
                <Link href="#channels">
                  Explore Channels
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            

          </div>
        </div>
      </section>

      {/* Channels Section */}
      <section id="channels" className="py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight mb-4 sm:mb-6">
              featured channels
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto px-2 sm:px-0">
              Carefully curated premium content for professionals
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-effect p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/5 animate-pulse w-full max-w-full">
                  <div className="h-24 sm:h-28 md:h-32 bg-white/5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6" />
                  <div className="h-3 sm:h-4 bg-white/5 rounded mb-2 sm:mb-3" />
                  <div className="h-3 bg-white/5 rounded w-2/3 mb-4 sm:mb-6" />
                  <div className="h-8 sm:h-10 bg-white/5 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredChannels.map((channel, index) => (
                <Card 
                  key={channel.id}
                  className={`glass-effect border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden group card-hover w-full max-w-full ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs font-light whitespace-nowrap">
                        ₹{channel.price}/mo
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                      {channel.name}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-muted-foreground font-light mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                      {channel.description}
                    </p>
                    

                    
                    <Button 
                      variant="outline" 
                      className="w-full glass-effect border-white/10 hover:border-white/20 font-light group text-sm sm:text-base"
                      asChild
                    >
                      <Link href={`/payment?channel=${channel.slug}`}>
                        Subscribe Now
                        <ArrowUpRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              size="lg"
              className="glass-effect border-white/10 hover:border-white/20 px-8 py-4 font-light rounded-full"
              asChild
            >
              <Link href="/auth">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-effect p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl sm:rounded-3xl border border-white/5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
              ready to get started?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-light mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
              Join thousands of professionals accessing premium telegram content
            </p>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium rounded-full w-full sm:w-auto"
              asChild
            >
              <Link href="/auth">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}