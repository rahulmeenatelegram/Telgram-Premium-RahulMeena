import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Shield, Users, Zap, CheckCircle, Star } from "lucide-react";
import Navbar from "@/components/navbar";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Industry-standard encryption and secure payment processing through Razorpay"
    },
    {
      icon: Users,
      title: "Premium Content",
      description: "Carefully curated Telegram channels with high-quality, professional content"
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Get immediate access to your subscribed channels after successful payment"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10,000+" },
    { label: "Premium Channels", value: "50+" },
    { label: "Success Rate", value: "99.9%" },
    { label: "Countries", value: "25+" }
  ];

  const values = [
    {
      title: "Transparency",
      description: "Clear pricing, no hidden fees, and complete transparency in all transactions"
    },
    {
      title: "Quality",
      description: "Only the highest quality channels make it to our platform after rigorous screening"
    },
    {
      title: "Support",
      description: "24/7 customer support to ensure the best experience for our users"
    },
    {
      title: "Innovation",
      description: "Continuous improvement and innovation in subscription management technology"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundGlow />
      <FloatingParticles />
      <Navbar />
      
      <div className="relative z-10 pt-20 sm:pt-24 lg:pt-32">
        {/* About Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-6 sm:mb-8 text-xs sm:text-sm font-light">
              About Onetapay
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight mb-6 sm:mb-8">
              revolutionizing telegram 
              <br />
              <span className="text-primary">channel access</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-light mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Onetapay bridges the gap between premium Telegram content creators and their audience, 
              providing a seamless subscription platform that benefits everyone.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium rounded-full"
              asChild
            >
              <Link href="/auth">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-light text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
                why choose onetapay?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                Built with modern technology and user experience in mind
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 sm:mb-6">
                      <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
                our values
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div key={index} className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">
                        {value.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-effect p-8 sm:p-12 md:p-16 rounded-2xl sm:rounded-3xl border border-white/5">
              <Star className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-6 sm:mb-8" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-6 sm:mb-8">
                our mission
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-light mb-8 sm:mb-12 leading-relaxed">
                To democratize access to premium content while ensuring creators are fairly compensated 
                for their valuable work. We believe in building bridges between knowledge creators and 
                seekers, making premium content accessible to everyone.
              </p>
              <Button 
                variant="outline" 
                size="lg"
                className="glass-effect border-white/10 hover:border-white/20 px-6 sm:px-8 py-4 sm:py-6 font-light rounded-full"
                asChild
              >
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}