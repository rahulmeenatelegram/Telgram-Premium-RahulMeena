import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, Shield, AlertTriangle, Clock, CreditCard } from "lucide-react";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";

export default function TermsPage() {
  const termsPrinciples = [
    {
      icon: Scale,
      title: "Fair Terms",
      description: "Clear, fair, and transparent terms that protect both users and service"
    },
    {
      icon: Shield,
      title: "User Protection",
      description: "Terms designed to protect your rights and ensure quality service"
    },
    {
      icon: Clock,
      title: "Timely Updates",
      description: "Regular updates to terms to reflect service improvements"
    },
    {
      icon: CreditCard,
      title: "Billing Clarity",
      description: "Clear billing terms with no hidden fees or surprises"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundGlow />
      <FloatingParticles />
      
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        {/* Terms Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 sm:mb-8 text-xs sm:text-sm font-light border-white/10">
              Terms and Conditions
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight mb-6 sm:mb-8">
              terms & conditions
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              These terms and conditions govern your use of our service. Please read them carefully 
              before using our platform.
            </p>
          </div>
        </section>

        {/* Terms Principles */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
                our commitments
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                The principles that guide our service terms
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {termsPrinciples.map((principle, index) => (
                <Card key={index} className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4 sm:mb-6">
                        <principle.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">
                        {principle.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 sm:space-y-12">
              
              {/* Business Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-primary" />
                  Business Information
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p><strong className="text-foreground">Service Name:</strong> Telegram Premium Access Service</p>
                      <p><strong className="text-foreground">Business Type:</strong> Digital Subscription Platform</p>
                      <p><strong className="text-foreground">Service Category:</strong> Digital Content & Channel Access</p>
                      <p><strong className="text-foreground">Established:</strong> 2024</p>
                    </div>
                    <div>
                      <p><strong className="text-foreground">Contact Email:</strong> <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a></p>
                      <p><strong className="text-foreground">Contact Phone:</strong> <a href="tel:+918696803045" className="text-primary hover:underline">+91 8696803045</a></p>
                      <p><strong className="text-foreground">Operating Territory:</strong> India</p>
                      <p><strong className="text-foreground">Service Availability:</strong> 24/7 Digital Access</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Service Description
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Primary Service:</strong> Subscription-based access to premium Telegram channels and content</p>
                  <p><strong className="text-foreground">Service Delivery:</strong> Digital access links provided instantly after payment verification</p>
                  <p><strong className="text-foreground">Content Type:</strong> Educational, informational, and entertainment content via Telegram channels</p>
                  <p><strong className="text-foreground">Access Method:</strong> Secure invitation links to private Telegram channels</p>
                  <p><strong className="text-foreground">Subscription Plans:</strong> Monthly, quarterly, and annual subscription options</p>
                  <p><strong className="text-foreground">Payment Processing:</strong> Secure payments through Razorpay payment gateway</p>
                </div>
              </div>

              {/* Terms of Service */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Terms of Service
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">1. Service Agreement</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• By subscribing, you agree to these terms and conditions</li>
                        <li>• Service is provided as-is with reasonable efforts for uptime</li>
                        <li>• Access is granted through secure Telegram channel invitations</li>
                        <li>• Subscription fees are non-refundable except as stated in refund policy</li>
                        <li>• Service availability subject to Telegram platform terms</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">2. User Responsibilities</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Maintain confidentiality of access credentials</li>
                        <li>• Use service only for personal, non-commercial purposes</li>
                        <li>• Respect intellectual property rights of content creators</li>
                        <li>• Report any technical issues promptly</li>
                        <li>• Comply with Telegram's terms of service</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">3. Prohibited Activities</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Sharing access credentials with unauthorized persons</li>
                        <li>• Attempting to circumvent payment systems</li>
                        <li>• Using service for illegal or harmful activities</li>
                        <li>• Reverse engineering or copying protected content</li>
                        <li>• Disrupting service operations or security</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">4. Payment Terms</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• All payments processed through Razorpay secure gateway</li>
                        <li>• Subscription fees charged in advance</li>
                        <li>• Auto-renewal unless cancelled by user</li>
                        <li>• No hidden fees or additional charges</li>
                        <li>• Payment confirmation sent via email</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">5. Service Modifications</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Service features may be updated or modified</li>
                        <li>• Pricing changes with 30-day advance notice</li>
                        <li>• Content availability subject to provider agreements</li>
                        <li>• Technical maintenance may cause temporary downtime</li>
                        <li>• Users notified of significant changes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing and Payments */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Billing & Payment Information
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Payment Gateway:</strong> Razorpay (PCI DSS compliant)</p>
                  <p><strong className="text-foreground">Accepted Methods:</strong> UPI, Credit/Debit Cards, Net Banking, Mobile Wallets</p>
                  <p><strong className="text-foreground">Currency:</strong> Indian Rupees (INR)</p>
                  <p><strong className="text-foreground">Billing Cycle:</strong> Monthly, Quarterly, or Annual (as selected)</p>
                  <p><strong className="text-foreground">Auto-Renewal:</strong> Enabled by default, can be disabled in account settings</p>
                  <p><strong className="text-foreground">Failed Payments:</strong> Service suspended until payment is resolved</p>
                  <p><strong className="text-foreground">Refund Policy:</strong> As detailed in our Cancellation & Refunds page</p>
                </div>
              </div>

              {/* Liability and Disclaimers */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Liability & Disclaimers
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Service Availability:</strong> We strive for 99.9% uptime but cannot guarantee uninterrupted service</p>
                  <p><strong className="text-foreground">Content Disclaimer:</strong> Third-party content is provided as-is; we are not responsible for its accuracy</p>
                  <p><strong className="text-foreground">Limitation of Liability:</strong> Our liability is limited to the subscription fee paid</p>
                  <p><strong className="text-foreground">Force Majeure:</strong> Not liable for service interruptions due to circumstances beyond our control</p>
                  <p><strong className="text-foreground">Platform Dependencies:</strong> Service depends on Telegram platform availability</p>
                </div>
              </div>

              {/* Data Protection */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Data Protection & Privacy
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Data Collection:</strong> We collect only necessary information for service provision</p>
                  <p><strong className="text-foreground">Data Security:</strong> All data encrypted and stored securely</p>
                  <p><strong className="text-foreground">Data Retention:</strong> Personal data retained only as long as necessary</p>
                  <p><strong className="text-foreground">Third-Party Sharing:</strong> No personal data sold or shared with third parties</p>
                  <p><strong className="text-foreground">User Rights:</strong> Users can request data access, correction, or deletion</p>
                  <p><strong className="text-foreground">Compliance:</strong> Compliant with applicable Indian data protection laws</p>
                </div>
              </div>

              {/* Termination */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Account Termination
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">User Termination:</strong> Users can cancel subscriptions at any time</p>
                  <p><strong className="text-foreground">Service Termination:</strong> We may terminate accounts for terms violations</p>
                  <p><strong className="text-foreground">Data Deletion:</strong> Account data deleted within 30 days of termination</p>
                  <p><strong className="text-foreground">Refund Upon Termination:</strong> Pro-rated refunds as per refund policy</p>
                  <p><strong className="text-foreground">Access Removal:</strong> Channel access removed immediately upon termination</p>
                </div>
              </div>

              {/* Legal Jurisdiction */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Legal Jurisdiction
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Governing Law:</strong> These terms are governed by the laws of India</p>
                  <p><strong className="text-foreground">Jurisdiction:</strong> Courts in India have exclusive jurisdiction</p>
                  <p><strong className="text-foreground">Dispute Resolution:</strong> Initial resolution through negotiation, then arbitration</p>
                  <p><strong className="text-foreground">Consumer Rights:</strong> Consumer Protection Act, 2019 rights reserved</p>
                  <p><strong className="text-foreground">Language:</strong> English version prevails in case of translation conflicts</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">For Terms Related Queries:</strong></p>
                  <p>Email: <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a></p>
                  <p>Phone: <a href="tel:+918696803045" className="text-primary hover:underline">+91 8696803045</a></p>
                  <p><strong className="text-foreground">Response Time:</strong> Within 24-48 hours</p>
                  <p><strong className="text-foreground">Business Hours:</strong> 9 AM - 9 PM IST (Monday to Sunday)</p>
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
