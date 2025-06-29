import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Phone, MapPin, Clock, Send } from "lucide-react";
import Navbar from "@/components/navbar";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help with your account or billing",
      value: "support@onetapay.com",
      action: "mailto:support@onetapay.com"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      value: "Available 24/7",
      action: "#"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      value: "+91 98765 43210",
      action: "tel:+919876543210"
    },
    {
      icon: MapPin,
      title: "Office Location",
      description: "Visit us at our headquarters",
      value: "Mumbai, India",
      action: "#"
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
      
      <div className="relative z-10 pt-20 sm:pt-24 lg:pt-32">
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

        {/* Contact Methods */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-16 sm:mb-20 md:mb-24">
              {contactInfo.map((info, index) => (
                <Card key={index} className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl hover:border-white/10 transition-colors">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <info.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      {info.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-light mb-3 sm:mb-4">
                      {info.description}
                    </p>
                    <div className="text-sm sm:text-base font-medium text-primary">
                      {info.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & FAQ */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Contact Form */}
              <div>
                <Card className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl">
                  <CardHeader className="p-6 sm:p-8">
                    <CardTitle className="text-xl sm:text-2xl font-light">Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-sm font-light">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            required 
                            className="mt-1 glass-effect border-white/10"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-sm font-light">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            required 
                            className="mt-1 glass-effect border-white/10"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-sm font-light">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          required 
                          className="mt-1 glass-effect border-white/10"
                          placeholder="john@example.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="subject" className="text-sm font-light">Subject</Label>
                        <Input 
                          id="subject" 
                          name="subject" 
                          required 
                          className="mt-1 glass-effect border-white/10"
                          placeholder="How can we help you?"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message" className="text-sm font-light">Message</Label>
                        <Textarea 
                          id="message" 
                          name="message" 
                          required 
                          rows={5}
                          className="mt-1 glass-effect border-white/10 resize-none"
                          placeholder="Tell us more about your inquiry..."
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-black hover:bg-white/90 font-medium"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Section */}
              <div>
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-light mb-3 sm:mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground font-light">
                    Quick answers to common questions
                  </p>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  {faqs.map((faq, index) => (
                    <Card key={index} className="glass-effect border-white/5 rounded-2xl">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Business Hours */}
                <Card className="glass-effect border-white/5 rounded-2xl mt-6 sm:mt-8">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-3" />
                      <h3 className="text-sm sm:text-base font-medium">Business Hours</h3>
                    </div>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground font-light">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM IST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM IST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                      <p className="text-xs sm:text-sm text-muted-foreground font-light">
                        For urgent issues, please email us and we'll respond within 2 hours.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}