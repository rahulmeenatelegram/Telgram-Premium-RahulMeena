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
              
              {/* Information We Collect */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Database className="w-6 h-6 mr-3 text-primary" />
                  Information Collection
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    We gather personal data (e.g., name, email, address, payment info) when you use our services. This information is essential for providing our subscription services and managing your account.
                  </p>
                  <p>
                    <strong className="text-foreground">Account Information:</strong> Your email address, username, and profile information.
                  </p>
                  <p>
                    <strong className="text-foreground">Payment Information:</strong> Payment details processed securely through our payment partners.
                  </p>
                  <p>
                    <strong className="text-foreground">Usage Data:</strong> Information about how you interact with our services.
                  </p>
                  <p>
                    <strong className="text-foreground">Communication Data:</strong> Records of your communications with our support team.
                  </p>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-primary" />
                  Use of Information
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    Data is used to provide and improve services, process payments, handle service requests, and send updates or promotional content (with your consent).
                  </p>
                  <ul className="space-y-2">
                    <li>• Provide and maintain our subscription service</li>
                    <li>• Process payments and manage billing</li>
                    <li>• Grant access to premium Telegram channels</li>
                    <li>• Send important service updates and notifications</li>
                    <li>• Provide customer support</li>
                    <li>• Improve our service and user experience</li>
                    <li>• Send promotional content (with your consent)</li>
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
                    We implement industry-standard measures (encryption, restricted access) to protect your data, though no method is fully secure online.
                  </p>
                  <ul className="space-y-2">
                    <li>• SSL/TLS encryption for all data transmission</li>
                    <li>• Secure database storage with access controls</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Limited access to personal data on a need-to-know basis</li>
                    <li>• Secure payment processing through trusted partners</li>
                  </ul>
                </div>
              </div>

              {/* Data Sharing */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Data Sharing
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    Personal data is never sold. We may share it with third-party service providers (e.g., payment processors, delivery partners) who adhere to confidentiality standards.
                  </p>
                </div>
              </div>

              {/* Cookies & Tracking */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Cookies & Tracking
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    We use cookies and similar tech for site functionality, analytics, and customization. You may disable cookies via browser settings.
                  </p>
                </div>
              </div>

              {/* Data Retention */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Data Retention
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    We retain data as long as your account exists or as needed to comply with the law.
                  </p>
                </div>
              </div>

              {/* Your Rights */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-primary" />
                  Your Rights
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>Depending on your location, you may access, correct, or request deletion of your data—contact us to act on your rights.</p>
                  <ul className="space-y-2">
                    <li>• <strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                    <li>• <strong className="text-foreground">Correction:</strong> Request correction of inaccurate data</li>
                    <li>• <strong className="text-foreground">Deletion:</strong> Request deletion of your personal data</li>
                    <li>• <strong className="text-foreground">Portability:</strong> Request transfer of your data</li>
                    <li>• <strong className="text-foreground">Objection:</strong> Object to processing of your data</li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us at <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a>
                  </p>
                </div>
              </div>

              {/* Policy Updates */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Policy Updates
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    We may update this policy; changes take effect upon posting, and continued use constitutes acceptance.
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
                    <p>Email: <a href="mailto:vickymeena0614@gmail.com" className="text-primary hover:underline">vickymeena0614@gmail.com</a></p>
                    <p>Phone: <a href="tel:+918696803045" className="text-primary hover:underline">+91 8696803045</a></p>
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
