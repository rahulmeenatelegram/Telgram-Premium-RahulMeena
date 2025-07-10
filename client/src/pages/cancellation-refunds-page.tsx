import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, CreditCard, Clock, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";

export default function CancellationRefundsPage() {
  const refundPolicies = [
    {
      icon: Clock,
      title: "24-Hour Guarantee",
      description: "Full refund available within 24 hours of purchase if you haven't accessed the channel"
    },
    {
      icon: CheckCircle,
      title: "Fair Processing",
      description: "Refund requests are processed fairly and typically within 3-5 business days"
    },
    {
      icon: CreditCard,
      title: "Multiple Methods",
      description: "Refunds are processed back to your original payment method or account credit"
    },
    {
      icon: Mail,
      title: "Support Assistance",
      description: "Our support team is here to help with any refund or cancellation questions"
    }
  ];

  const refundScenarios = [
    {
      scenario: "Technical Issues",
      description: "If you experience technical issues preventing access to your subscription",
      eligibility: "Eligible for full refund or service extension",
      timeline: "Immediate upon verification"
    },
    {
      scenario: "Service Downtime",
      description: "Extended service outages affecting your subscription period",
      eligibility: "Service extension or partial refund",
      timeline: "Automatic compensation"
    },
    {
      scenario: "Billing Errors",
      description: "Incorrect charges or duplicate payments",
      eligibility: "Full refund of erroneous charges",
      timeline: "Within 24-48 hours"
    },
    {
      scenario: "Channel Discontinuation",
      description: "If a subscribed channel becomes unavailable",
      eligibility: "Prorated refund for unused period",
      timeline: "Within 3-5 business days"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundGlow />
      <FloatingParticles />
      
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        {/* Cancellation Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 sm:mb-8 text-xs sm:text-sm font-light border-white/10">
              Cancellation & Refunds
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight mb-6 sm:mb-8">
              cancellation & refunds
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              We want you to be completely satisfied with our service. Learn about our fair and transparent 
              cancellation and refund policies.
            </p>
          </div>
        </section>

        {/* Refund Policies */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
                our refund promise
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                Fair and transparent policies to protect your investment
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {refundPolicies.map((policy, index) => (
                <Card key={index} className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4 sm:mb-6">
                        <policy.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">
                        {policy.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                        {policy.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cancellation Policy */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 sm:space-y-12">
              
              {/* How to Cancel */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <RefreshCw className="w-6 h-6 mr-3 text-primary" />
                  Auto-Renewal & Cancellation
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    <strong className="text-foreground">Auto-renewal subscriptions:</strong> Auto-renewal subscriptions automatically renew and are billed at each cycle until cancelled.
                  </p>
                  <p>
                    To cancel, users may turn off auto-renew in their account settings or contact us at <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a>. Cancellation takes effect at the end of the current billing cycle.
                  </p>
                  <ol className="space-y-2 ml-4 list-decimal">
                    <li>Log into your account dashboard</li>
                    <li>Navigate to the "Subscriptions" section</li>
                    <li>Click "Cancel Subscription" or turn off auto-renew</li>
                    <li>Confirm your cancellation</li>
                    <li>You'll receive a confirmation email</li>
                  </ol>
                </div>
              </div>

              {/* Refund Policy */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-primary" />
                  Refund Policy
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    <strong className="text-foreground">No Refunds:</strong> No refunds are issued for unused time after cancellation or for voluntary account deletion.
                  </p>
                  <p>
                    Once you have accessed the premium content, refunds are generally not available unless there are exceptional circumstances such as:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Technical issues preventing access to your subscription</li>
                    <li>• Billing errors or duplicate charges</li>
                    <li>• Service downtime exceeding 24 hours</li>
                    <li>• Channel discontinuation by the content creator</li>
                  </ul>
                </div>
              </div>

              {/* Policy Updates */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-primary" />
                  Policy Updates
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    We reserve the right to modify this policy at any time; continued use after any change implies acceptance.
                  </p>
                  <p>
                    Any changes to this policy will be posted on this page and will take effect immediately upon posting.
                  </p>
                </div>
              </div>

              {/* Contact for Refunds */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Contact Us
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    If you have any questions about our refund policy or need to request a refund:
                  </p>
                  <div className="space-y-2">
                    <p>
                      <strong className="text-foreground">Email:</strong> 
                      <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline ml-1">vickymeena0614@gmail.com</a>
                    </p>
                    <p>
                      <strong className="text-foreground">Phone:</strong> 
                      <a href="tel:+918696803045" className="text-primary hover:underline ml-1">+91 8696803045</a>
                    </p>
                    <p>
                      <strong className="text-foreground">Response Time:</strong> We aim to respond to all refund requests within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-center pt-8 border-t border-white/5">
                <p className="text-sm text-muted-foreground font-light">
                  Last updated: July 2025
                </p>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
