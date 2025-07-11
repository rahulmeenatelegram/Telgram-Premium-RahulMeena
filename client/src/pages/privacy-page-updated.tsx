import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, Users, FileText } from "lucide-react";
import { BackgroundGlow, FloatingParticles } from "@/components/background-effects";

export default function PrivacyPage() {
  const privacyPrinciples = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "We use industry-standard encryption to protect your personal information"
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear and honest about what data we collect and how we use it"
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description: "Your data is stored securely with regular security audits and updates"
    },
    {
      icon: Users,
      title: "No Sharing",
      description: "We never sell or share your personal information with third parties"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundGlow />
      <FloatingParticles />
      
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        {/* Privacy Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 sm:mb-8 text-xs sm:text-sm font-light border-white/10">
              Privacy Policy
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight mb-6 sm:mb-8">
              your privacy matters
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-4 sm:mb-6">
                our privacy principles
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                The core values that guide our approach to privacy
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {privacyPrinciples.map((principle, index) => (
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

        {/* Privacy Policy Content */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 sm:space-y-12">
              
              {/* Business Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Business Information
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p><strong className="text-foreground">Service Name:</strong> Telegram Premium Access Service</p>
                      <p><strong className="text-foreground">Business Type:</strong> Digital Content Subscription Platform</p>
                      <p><strong className="text-foreground">Service Category:</strong> Digital Media & Communication</p>
                      <p><strong className="text-foreground">Data Controller:</strong> Telegram Premium Access Service</p>
                    </div>
                    <div>
                      <p><strong className="text-foreground">Contact Email:</strong> <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a></p>
                      <p><strong className="text-foreground">Contact Phone:</strong> <a href="tel:+918696803045" className="text-primary hover:underline">+91 8696803045</a></p>
                      <p><strong className="text-foreground">Operating Territory:</strong> India</p>
                      <p><strong className="text-foreground">Establishment:</strong> 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information We Collect */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Database className="w-6 h-6 mr-3 text-primary" />
                  Information Collection
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">1. Personal Information</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• <strong className="text-foreground">Account Information:</strong> Email address, username, profile information</li>
                        <li>• <strong className="text-foreground">Contact Details:</strong> Phone number (optional), preferred communication method</li>
                        <li>• <strong className="text-foreground">Identity Information:</strong> Name, age (if provided), location (general)</li>
                        <li>• <strong className="text-foreground">Communication Records:</strong> Support tickets, feedback, correspondence</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">2. Payment Information</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• <strong className="text-foreground">Payment Details:</strong> Processed securely through Razorpay</li>
                        <li>• <strong className="text-foreground">Billing Information:</strong> Subscription plans, payment history</li>
                        <li>• <strong className="text-foreground">Transaction Records:</strong> Order IDs, payment confirmations</li>
                        <li>• <strong className="text-foreground">Financial Data:</strong> We do not store credit card or bank details</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">3. Usage Information</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• <strong className="text-foreground">Service Usage:</strong> Subscription activity, channel access patterns</li>
                        <li>• <strong className="text-foreground">Technical Data:</strong> Device type, browser, IP address, access times</li>
                        <li>• <strong className="text-foreground">Preferences:</strong> Settings, notification preferences, communication choices</li>
                        <li>• <strong className="text-foreground">Analytics:</strong> Aggregated usage statistics (non-personal)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-primary" />
                  Use of Information
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">1. Service Provision</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Provide and maintain subscription services</li>
                        <li>• Grant access to premium Telegram channels</li>
                        <li>• Process payments and manage billing</li>
                        <li>• Deliver customer support and assistance</li>
                        <li>• Manage user accounts and preferences</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">2. Communication</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Send service updates and important notifications</li>
                        <li>• Respond to support requests and inquiries</li>
                        <li>• Provide payment confirmations and receipts</li>
                        <li>• Send promotional content (with consent only)</li>
                        <li>• Notify about policy changes and updates</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">3. Service Improvement</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Analyze usage patterns to improve service quality</li>
                        <li>• Develop new features and functionalities</li>
                        <li>• Conduct security monitoring and fraud prevention</li>
                        <li>• Optimize user experience and interface</li>
                        <li>• Perform technical maintenance and updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-primary" />
                  Data Security
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">Security Measures:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• <strong className="text-foreground">Encryption:</strong> SSL/TLS encryption for all data transmission</li>
                        <li>• <strong className="text-foreground">Storage:</strong> Secure database storage with access controls</li>
                        <li>• <strong className="text-foreground">Authentication:</strong> Multi-factor authentication for admin access</li>
                        <li>• <strong className="text-foreground">Monitoring:</strong> 24/7 security monitoring and threat detection</li>
                        <li>• <strong className="text-foreground">Audits:</strong> Regular security audits and vulnerability assessments</li>
                        <li>• <strong className="text-foreground">Compliance:</strong> PCI DSS compliance for payment processing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">Data Protection:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Limited access to personal data on need-to-know basis</li>
                        <li>• Employee training on data protection and privacy</li>
                        <li>• Regular backups with encryption</li>
                        <li>• Secure third-party integrations</li>
                        <li>• Incident response procedures in place</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-primary" />
                  Your Privacy Rights
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">You Have the Right To:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• <strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                        <li>• <strong className="text-foreground">Correction:</strong> Request correction of inaccurate data</li>
                        <li>• <strong className="text-foreground">Deletion:</strong> Request deletion of your personal data</li>
                        <li>• <strong className="text-foreground">Portability:</strong> Request transfer of your data</li>
                        <li>• <strong className="text-foreground">Restriction:</strong> Request limitation of data processing</li>
                        <li>• <strong className="text-foreground">Objection:</strong> Object to certain types of processing</li>
                        <li>• <strong className="text-foreground">Consent Withdrawal:</strong> Withdraw consent for processing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">How to Exercise Rights:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Email us at <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a></li>
                        <li>• Call us at <a href="tel:+918696803045" className="text-primary hover:underline">+91 8696803045</a></li>
                        <li>• Include your account details and specific request</li>
                        <li>• We respond within 30 days</li>
                        <li>• Identity verification may be required</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Contact Us
                </h3>
                <div className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p className="mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p><strong className="text-foreground">Privacy Officer:</strong> Telegram Premium Access Service</p>
                    <p><strong className="text-foreground">Email:</strong> <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a></p>
                    <p><strong className="text-foreground">Phone:</strong> <a href="tel:+918696803045" className="text-primary hover:underline">+91 8696803045</a></p>
                    <p><strong className="text-foreground">Response Time:</strong> Within 30 days</p>
                    <p><strong className="text-foreground">Business Hours:</strong> 9 AM - 9 PM IST (Monday to Sunday)</p>
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
