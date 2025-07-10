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
                our commitment
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                The principles that guide our terms and service
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
              
              {/* Acceptance of Terms */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-primary" />
                  Acceptance of Terms
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    By using our site/services ("Service") you agree to these Terms & Conditions. If you do not agree to abide by these terms, please do not use this service.
                  </p>
                  <p>
                    These terms constitute a legally binding agreement between you and our service. Your continued use of our service indicates your acceptance of these terms.
                  </p>
                </div>
              </div>

              {/* User Obligations */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Scale className="w-6 h-6 mr-3 text-primary" />
                  User Obligations
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    You're responsible for lawful use of the Service, keeping your account secure, and compliance with all laws.
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Provide accurate and current information when creating an account</li>
                    <li>• Maintain the security of your account credentials</li>
                    <li>• Use the service only for lawful purposes</li>
                    <li>• Not share your account access with others</li>
                    <li>• Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
              </div>

              {/* Prohibited Use */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-primary" />
                  Prohibited Use
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    Misuse, interference, reverse engineering, or infringing content is forbidden. The following activities are strictly prohibited:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Attempting to circumvent payment systems</li>
                    <li>• Creating multiple accounts to abuse promotions</li>
                    <li>• Sharing subscription access with unauthorized users</li>
                    <li>• Using the service for any illegal or harmful activities</li>
                    <li>• Attempting to reverse engineer or hack our systems</li>
                    <li>• Interfering with the proper functioning of the service</li>
                  </ul>
                </div>
              </div>

              {/* Service Modifications */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-primary" />
                  Service Modifications
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    We may update, suspend, or terminate the Service with or without notice. We reserve the right to modify, suspend, or discontinue any part of our service at our discretion.
                  </p>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Intellectual Property
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    All rights, titles, and interest in our content and trademarks are owned by us. You may not use our intellectual property without express written permission.
                  </p>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Limitation of Liability
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    Our liability is limited to the amount you've paid in the last six months; not liable for indirect or consequential losses. To the maximum extent permitted by law, we shall not be liable for any damages arising from your use of the service.
                  </p>
                </div>
              </div>

              {/* Indemnification */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Indemnification
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    You agree to defend and hold us harmless from claims arising out of your misuse of the service or violation of these terms.
                  </p>
                </div>
              </div>

              {/* Termination */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Termination
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    We may terminate or suspend your account at our discretion, without refund. Upon termination, your right to use the service ceases immediately.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Governing Law
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p>
                    These terms are governed by the laws of India, and disputes will be resolved in its courts.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="glass-effect border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
                  Contact Information
                </h3>
                <div className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  <p className="mb-4">
                    If you have any questions about these Terms and Conditions, please contact us:
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
