import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Cloud, Globe, Shield, Clock, Smartphone } from "lucide-react";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";

export default function ShippingPage() {
  const deliveryFeatures = [
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Access granted immediately after successful payment verification"
    },
    {
      icon: Cloud,
      title: "Digital Access",
      description: "No physical shipping required - everything is delivered digitally"
    },
    {
      icon: Globe,
      title: "Global Availability",
      description: "Available worldwide - no geographical restrictions"
    },
    {
      icon: Shield,
      title: "Secure Delivery",
      description: "Encrypted and secure access links delivered to your account"
    }
  ];

  const accessSteps = [
    {
      step: "1",
      title: "Complete Payment",
      description: "Secure payment processing through Razorpay",
      timeframe: "30 seconds"
    },
    {
      step: "2",
      title: "Account Verification",
      description: "Automatic verification of payment and account status",
      timeframe: "1-2 minutes"
    },
    {
      step: "3",
      title: "Access Granted",
      description: "Telegram channel access link delivered to your dashboard",
      timeframe: "Instant"
    },
    {
      step: "4",
      title: "Join Channel",
      description: "Click the provided link to join your premium channel",
      timeframe: "Immediate"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundGlow />
      <FloatingParticles />
      
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        {/* Shipping Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 sm:mb-8 text-xs sm:text-sm font-light border-white/10">
              Access & Delivery Policy
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight mb-6 sm:mb-8">
              access & delivery policy
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              Instant Access: Once the payment is successfully completed, users will receive a secure link to join our Telegram channel. 
              No physical shipping required - everything is delivered digitally.
            </p>
          </div>
        </section>

        {/* Delivery Features */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
                how it works
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                Our digital delivery system ensures you get access instantly
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {deliveryFeatures.map((feature, index) => (
                <Card key={index} className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4 sm:mb-6">
                        <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">
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

        {/* Access Process */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
                access process
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                From payment to access in minutes
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {accessSteps.map((step, index) => (
                <div key={index} className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                      <span className="text-lg sm:text-xl font-semibold text-primary">
                        {step.step}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-lg sm:text-xl font-medium text-foreground">
                          {step.title}
                        </h3>
                        <Badge className="text-xs font-light bg-primary/10 text-primary border-primary/20 mt-2 sm:mt-0 w-fit">
                          {step.timeframe}
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Digital Delivery Details */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 sm:space-y-12">
              
              {/* What You Receive */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Smartphone className="w-6 h-6 mr-3 text-primary" />
                  Instant Access
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    <strong className="text-foreground">Instant Access:</strong> Once the payment is successfully completed, users will receive a secure link to join our Telegram channel.
                  </p>
                  <p>
                    <strong className="text-foreground">Delivery Method:</strong> The channel access link is delivered instantly on the confirmation page and/or via email/SMS.
                  </p>
                  <p>
                    <strong className="text-foreground">No Physical Shipping:</strong> We do not sell or ship any physical goods. All access is digital and instant.
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Secure access link to your premium Telegram channel</li>
                    <li>• Account dashboard with subscription management tools</li>
                    <li>• Email confirmation with access details</li>
                    <li>• Subscription expiry date and renewal information</li>
                  </ul>
                </div>
              </div>

              {/* Access Issues */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-primary" />
                  Access Issues
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    <strong className="text-foreground">If you do not receive the link or face any issue accessing the Telegram channel, please contact our support team within 24 hours of purchase.</strong>
                  </p>
                  <p>
                    We are committed to resolving any access issues promptly to ensure you can enjoy your premium content without delay.
                  </p>
                  <div className="space-y-2">
                    <p>
                      <strong className="text-foreground">Contact Support:</strong> 
                      <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline ml-1">vickymeena0614@gmail.com</a>
                    </p>
                    <p>
                      <strong className="text-foreground">Phone:</strong> 
                      <a href="tel:+918696803045" className="text-primary hover:underline ml-1">+91 8696803045</a>
                    </p>
                    <p>
                      <strong className="text-foreground">Response Time:</strong> Within 24 hours of purchase
                    </p>
                  </div>
                </div>
              </div>

              {/* User Responsibility */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  User Responsibility
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    <strong className="text-foreground">It is the customer's responsibility to ensure their Telegram app is working and they are using the correct account for access.</strong>
                  </p>
                  <p>
                    Before making a purchase, please ensure:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Your Telegram app is installed and working properly</li>
                    <li>• You are logged into the correct Telegram account</li>
                    <li>• Your device has internet connectivity</li>
                    <li>• You have provided the correct contact information</li>
                  </ul>
                </div>
              </div>

              {/* Support */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Need Help?
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    If you experience any issues with accessing your channels:
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
                      <strong className="text-foreground">Response Time:</strong> 
                      Within 24 hours of your inquiry
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Business & Service Information
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p><strong className="text-foreground">Service Type:</strong> Digital Content Delivery</p>
                      <p><strong className="text-foreground">Business Category:</strong> Digital Subscription Platform</p>
                      <p><strong className="text-foreground">Delivery Method:</strong> Instant Digital Access</p>
                      <p><strong className="text-foreground">Service Area:</strong> Global (Internet-based)</p>
                    </div>
                    <div>
                      <p><strong className="text-foreground">Contact Email:</strong> <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a></p>
                      <p><strong className="text-foreground">Contact Phone:</strong> <a href="tel:+918696803045" className="text-primary hover:underline">+91 8696803045</a></p>
                      <p><strong className="text-foreground">Operating Hours:</strong> 24/7 Automated Service</p>
                      <p><strong className="text-foreground">Support Hours:</strong> 9 AM - 9 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Delivery Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Digital Service Delivery Details
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">1. What We Deliver</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Digital access to premium Telegram channels</li>
                        <li>• Secure invitation links to private content</li>
                        <li>• Account dashboard access credentials</li>
                        <li>• Subscription management tools</li>
                        <li>• Customer support and technical assistance</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">2. Delivery Process</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Payment processed through Razorpay secure gateway</li>
                        <li>• Automated verification of payment status</li>
                        <li>• Instant account activation upon payment confirmation</li>
                        <li>• Access links delivered to registered email</li>
                        <li>• Dashboard access available immediately</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">3. Delivery Timeframes</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• <strong className="text-foreground">Instant:</strong> Most payments processed within 30 seconds</li>
                        <li>• <strong className="text-foreground">Standard:</strong> Up to 5 minutes for verification</li>
                        <li>• <strong className="text-foreground">Delayed:</strong> Up to 24 hours for manual review cases</li>
                        <li>• <strong className="text-foreground">Failed Payments:</strong> Immediate notification and support</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">4. Access Requirements</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Active internet connection required</li>
                        <li>• Telegram app installed on device</li>
                        <li>• Valid email address for account management</li>
                        <li>• Compatible device (smartphone, tablet, or computer)</li>
                        <li>• Updated web browser for dashboard access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Technical Specifications
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Platform:</strong> Telegram-based content delivery</p>
                  <p><strong className="text-foreground">Compatibility:</strong> All devices supporting Telegram (iOS, Android, Windows, Mac, Linux)</p>
                  <p><strong className="text-foreground">Internet Required:</strong> Yes, for initial setup and ongoing access</p>
                  <p><strong className="text-foreground">Storage:</strong> No local storage required - cloud-based access</p>
                  <p><strong className="text-foreground">Bandwidth:</strong> Minimal - depends on content consumption</p>
                  <p><strong className="text-foreground">Security:</strong> End-to-end encryption via Telegram's security protocols</p>
                </div>
              </div>

              {/* Delivery Confirmation */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Delivery Confirmation & Tracking
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Email Confirmation:</strong> Instant confirmation sent to registered email</p>
                  <p><strong className="text-foreground">Dashboard Updates:</strong> Real-time status updates in user dashboard</p>
                  <p><strong className="text-foreground">Access Verification:</strong> Automated testing of channel access links</p>
                  <p><strong className="text-foreground">Support Notifications:</strong> Proactive alerts for any delivery issues</p>
                  <p><strong className="text-foreground">Delivery Receipt:</strong> Digital receipt with access details</p>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Delivery Issues & Resolution
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-2">Common Issues:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Payment processing delays</li>
                        <li>• Email delivery to spam folder</li>
                        <li>• Telegram app not installed</li>
                        <li>• Invalid or expired links</li>
                        <li>• Account verification pending</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-2">Resolution Process:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Immediate automated diagnostics</li>
                        <li>• Email support response within 24 hours</li>
                        <li>• Phone support for urgent issues</li>
                        <li>• Manual verification and redelivery</li>
                        <li>• Full refund if delivery cannot be completed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Delivery Integration */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Payment & Delivery Integration
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Payment Gateway:</strong> Razorpay (India's leading payment processor)</p>
                  <p><strong className="text-foreground">Supported Methods:</strong> UPI, Cards, Net Banking, Mobile Wallets</p>
                  <p><strong className="text-foreground">Currency:</strong> Indian Rupees (INR)</p>
                  <p><strong className="text-foreground">Security:</strong> PCI DSS compliant payment processing</p>
                  <p><strong className="text-foreground">Delivery Trigger:</strong> Automated upon successful payment confirmation</p>
                  <p><strong className="text-foreground">Failure Handling:</strong> Automatic retry and manual intervention</p>
                </div>
              </div>

              {/* Customer Support */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Customer Support & Assistance
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Email Support:</strong> <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a></p>
                  <p><strong className="text-foreground">Phone Support:</strong> <a href="tel:+918696803045" className="text-primary hover:underline">+91 8696803045</a></p>
                  <p><strong className="text-foreground">Response Time:</strong> Email within 24 hours, phone immediate</p>
                  <p><strong className="text-foreground">Support Languages:</strong> English, Hindi</p>
                  <p><strong className="text-foreground">Technical Support:</strong> Available for delivery and access issues</p>
                  <p><strong className="text-foreground">Escalation:</strong> Senior support team for complex issues</p>
                </div>
              </div>

              {/* Legal & Compliance */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Legal & Compliance Information
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Service Location:</strong> India</p>
                  <p><strong className="text-foreground">Regulatory Compliance:</strong> IT Act 2000, Consumer Protection Act 2019</p>
                  <p><strong className="text-foreground">Data Protection:</strong> Compliant with Indian data protection laws</p>
                  <p><strong className="text-foreground">Consumer Rights:</strong> All applicable consumer protection rights reserved</p>
                  <p><strong className="text-foreground">Dispute Resolution:</strong> Governed by Indian law and jurisdiction</p>
                  <p><strong className="text-foreground">Terms Integration:</strong> Subject to our Terms and Conditions</p>
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
