import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Phone, MapPin, Clock, Send, Instagram, Youtube } from "lucide-react";
import Navbar from "@/components/navbar";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socialLinks = [
    {
      icon: Mail,
      title: "Email",
      description: "Send us an email",
      value: "support@onetapay.com",
      action: "mailto:support@onetapay.com",
      color: "bg-blue-500"
    },
    {
      icon: Instagram,
      title: "Instagram",
      description: "Follow us on Instagram",
      value: "@onetapay",
      action: "https://instagram.com/onetapay",
      color: "bg-pink-500"
    },
    {
      icon: Youtube,
      title: "YouTube",
      description: "Subscribe to our channel",
      value: "Onetapay",
      action: "https://youtube.com/@onetapay",
      color: "bg-red-500"
    },
    {
      icon: MessageCircle,
      title: "Support",
      description: "Get help with your account",
      value: "Chat with us",
      action: "#",
      color: "bg-green-500"
    }
  ];

  const faqs = [
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime from your account dashboard. No questions asked, no cancellation fees."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, and net banking through Razorpay's secure platform."
    },
    {
      question: "How quickly will I get access after payment?",
      answer: "Access is instant! You'll receive your Telegram channel link immediately after successful payment."
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use industry-standard encryption and never store your payment details on our servers."
    }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundGlow />
      <FloatingParticles />
      <Navbar />
      
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        {/* Contact Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-6 sm:mb-8 text-xs sm:text-sm font-light">
              Contact Us
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight mb-6 sm:mb-8">
              get in touch
              <br />
              <span className="text-primary">we're here to help</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-light mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Have questions about our platform? Need help with your subscription? 
              Our dedicated support team is ready to assist you.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-light mb-3 sm:mb-4">Get in Touch</h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light">Reach out to us for support and assistance</p>
            </div>
            <div className="max-w-md mx-auto">
              <Card className="glass-effect border-white/5 rounded-xl sm:rounded-2xl">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-blue-500 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">Email Support</h3>
                  <p className="text-sm text-muted-foreground font-light mb-4">
                    Send us an email for any questions or support
                  </p>
                  <div className="text-base font-medium text-primary">
                    support@onetapay.com
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-light mb-3 sm:mb-4">Frequently Asked Questions</h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light">Find answers to common questions</p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <Card className="glass-effect border-white/5 rounded-xl sm:rounded-2xl">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                    How do I access my subscribed channels?
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                    After successful payment, you'll receive an access link that allows you to join the premium Telegram channel.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-white/5 rounded-xl sm:rounded-2xl">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                    Can I cancel my subscription anytime?
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                    Yes, you can cancel your subscription at any time through your dashboard. Your access will continue until the end of your current billing period.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-white/5 rounded-xl sm:rounded-2xl">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                    We accept UPI, credit cards, debit cards, and other payment methods through our secure Razorpay integration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}