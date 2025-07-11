import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, Users, FileText } from "lucide-react";
import              {/* Business Information */}
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

              {/* Data Sharing */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Data Sharing & Third Parties
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">We Share Data With:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• <strong className="text-foreground">Payment Processors:</strong> Razorpay (for payment processing only)</li>
                        <li>• <strong className="text-foreground">Service Providers:</strong> Hosting, email, and technical support services</li>
                        <li>• <strong className="text-foreground">Legal Authorities:</strong> When required by law or legal process</li>
                        <li>• <strong className="text-foreground">Business Transfers:</strong> In case of merger, acquisition, or sale</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">We Never:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Sell personal data to third parties</li>
                        <li>• Share data for marketing purposes without consent</li>
                        <li>• Provide data to unauthorized parties</li>
                        <li>• Use data for purposes not disclosed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cookies & Tracking */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Cookies & Tracking Technologies
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">Types of Cookies:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• <strong className="text-foreground">Essential Cookies:</strong> Required for basic site functionality</li>
                        <li>• <strong className="text-foreground">Authentication Cookies:</strong> To keep you logged in</li>
                        <li>• <strong className="text-foreground">Preference Cookies:</strong> To remember your settings</li>
                        <li>• <strong className="text-foreground">Analytics Cookies:</strong> To understand site usage (with consent)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3">Cookie Control:</h4>
                      <ul className="space-y-2 pl-4">
                        <li>• Browser settings allow cookie control</li>
                        <li>• Opt-out options available for non-essential cookies</li>
                        <li>• Cookie preferences can be updated anytime</li>
                        <li>• No tracking without explicit consent</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Retention */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Data Retention
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Account Data:</strong> Retained while account is active and for 30 days after cancellation</p>
                  <p><strong className="text-foreground">Payment Records:</strong> Retained for 7 years for accounting and tax purposes</p>
                  <p><strong className="text-foreground">Communication Records:</strong> Retained for 2 years for customer service purposes</p>
                  <p><strong className="text-foreground">Legal Requirements:</strong> Some data may be retained longer if required by law</p>
                  <p><strong className="text-foreground">Data Deletion:</strong> Secure deletion procedures implemented for expired data</p>
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

              {/* International Transfers */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  International Data Transfers
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Primary Location:</strong> Data primarily stored and processed in India</p>
                  <p><strong className="text-foreground">Service Providers:</strong> Some service providers may be located outside India</p>
                  <p><strong className="text-foreground">Safeguards:</strong> Appropriate safeguards ensure data protection during transfers</p>
                  <p><strong className="text-foreground">Legal Basis:</strong> Transfers based on adequacy decisions or standard contractual clauses</p>
                  <p><strong className="text-foreground">Third-Party Compliance:</strong> All third parties must meet equivalent data protection standards</p>
                </div>
              </div>

              {/* Policy Updates */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Policy Updates
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Update Frequency:</strong> Reviewed and updated annually or as needed</p>
                  <p><strong className="text-foreground">Notification:</strong> Users notified of significant changes via email</p>
                  <p><strong className="text-foreground">Effective Date:</strong> Changes take effect 30 days after posting</p>
                  <p><strong className="text-foreground">Continued Use:</strong> Continued use constitutes acceptance of updates</p>
                  <p><strong className="text-foreground">Version Control:</strong> Previous versions available upon request</p>
                </div>
              </div>

              {/* Legal Compliance */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Legal Compliance
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p><strong className="text-foreground">Applicable Laws:</strong> Information Technology Act, 2000 and Rules</p>
                  <p><strong className="text-foreground">Consumer Protection:</strong> Consumer Protection Act, 2019</p>
                  <p><strong className="text-foreground">Data Protection:</strong> Personal Data Protection Bill (when enacted)</p>
                  <p><strong className="text-foreground">Jurisdiction:</strong> Indian courts have jurisdiction over privacy matters</p>
                  <p><strong className="text-foreground">Regulatory Authority:</strong> Subject to applicable regulatory oversight</p>
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
              </div>kgroundGlow, FloatingParticles } from "@/components/background-effects";

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
              
              {/* Information We Collect */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Database className="w-6 h-6 mr-3 text-primary" />
                  Information We Collect
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    <strong className="text-foreground">Account Information:</strong> When you create an account, we collect your email address, username, and encrypted authentication data through Firebase.
                  </p>
                  <p>
                    <strong className="text-foreground">Payment Information:</strong> Payment processing is handled securely by Razorpay. We don't store your payment card details on our servers.
                  </p>
                  <p>
                    <strong className="text-foreground">Usage Data:</strong> We collect information about how you use our service, including subscription history and access patterns.
                  </p>
                  <p>
                    <strong className="text-foreground">Telegram Data:</strong> We store your Telegram user ID to manage channel access and subscriptions.
                  </p>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-primary" />
                  How We Use Your Information
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <ul className="space-y-2">
                    <li>• Provide and maintain our subscription service</li>
                    <li>• Process payments and manage billing</li>
                    <li>• Grant access to premium Telegram channels</li>
                    <li>• Send important service updates and notifications</li>
                    <li>• Provide customer support</li>
                    <li>• Improve our service and user experience</li>
                    <li>• Comply with legal obligations</li>
                  </ul>
                </div>
              </div>

              {/* Data Security */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-primary" />
                  Data Security
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    We implement industry-standard security measures to protect your personal information:
                  </p>
                  <ul className="space-y-2">
                    <li>• SSL/TLS encryption for all data transmission</li>
                    <li>• Secure database storage with access controls</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Limited access to personal data on a need-to-know basis</li>
                    <li>• Secure payment processing through Razorpay</li>
                  </ul>
                </div>
              </div>

              {/* Your Rights */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-primary" />
                  Your Rights
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>You have the following rights regarding your personal data:</p>
                  <ul className="space-y-2">
                    <li>• <strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                    <li>• <strong className="text-foreground">Correction:</strong> Request correction of inaccurate data</li>
                    <li>• <strong className="text-foreground">Deletion:</strong> Request deletion of your personal data</li>
                    <li>• <strong className="text-foreground">Portability:</strong> Request transfer of your data</li>
                    <li>• <strong className="text-foreground">Objection:</strong> Object to processing of your data</li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us at <a href="mailto:privacy@onetapay.com" className="text-primary hover:underline">privacy@onetapay.com</a>
                  </p>
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
                    <p>Email: <a href="mailto:privacy@onetapay.com" className="text-primary hover:underline">privacy@onetapay.com</a></p>
                    <p>Support: <a href="mailto:support@onetapay.com" className="text-primary hover:underline">support@onetapay.com</a></p>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-center pt-8 border-t border-white/5">
                <p className="text-sm text-muted-foreground font-light">
                  Last updated: January 2025
                </p>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
