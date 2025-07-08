import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Shield, Users, Zap, CheckCircle, Star, Mail } from "lucide-react";
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

  const faqs = [
    {
      question: "How do subscriptions work?",
      answer: "Choose your billing cycle (monthly or yearly), make a secure payment, and get instant access to premium Telegram channels. Access is valid for exactly 30 days and requires manual renewal."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time from your dashboard. You'll continue to have access until your current billing period ends."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI, debit/credit cards, and net banking through our secure Razorpay integration."
    },
    {
      question: "How do I access my channels?",
      answer: "After successful payment, you'll receive unique access links to join the premium Telegram channels you've subscribed to."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundGlow />
      <FloatingParticles />
      <Navbar />
      
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <Badge 
                variant="outline" 
                className="glass-effect border-white/10 mb-6 sm:mb-8 px-4 py-2 text-xs sm:text-sm font-light"
              >
                About Onetapay
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-tight mb-6 sm:mb-8">
                premium content,{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  simplified
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
                We bridge the gap between premium content creators and subscribers, 
                providing a seamless subscription experience for Telegram channels.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
                why choose us
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                Experience the future of premium content subscriptions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <Card key={index} className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4 sm:mb-6">
                        <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-medium mb-3 sm:mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
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

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
                frequently asked questions
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light">
                Everything you need to know about Onetapay
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-effect border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}