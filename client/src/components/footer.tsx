import { Link } from "wouter";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  const policyLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/cancellation-refunds", label: "Cancellation & Refunds" },
    { href: "/shipping", label: "Access & Delivery Policy" },
  ];

  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/auth", label: "Sign In" },
  ];

  const contactLinks = [
    {
      href: "mailto:vickymeena0614@gmail.com",
      icon: Mail,
      label: "Email",
      value: "vickymeena0614@gmail.com"
    },
    {
      href: "tel:+918696803045",
      icon: Phone,
      label: "Phone",
      value: "8696803045"
    }
  ];

  return (
    <footer className="bg-background border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              Onetapay
            </h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Premium Telegram channel subscriptions made simple. 
              Secure, instant, and reliable access to exclusive content.
            </p>
            <div className="flex space-x-4">
              {contactLinks.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label={contact.label}
                >
                  <contact.icon className="w-5 h-5 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Legal
            </h3>
            <ul className="space-y-2">
              {policyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:vickymeena0614@gmail.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  vickymeena0614@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918696803045"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +91 8696803045
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  24/7 Customer Support
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Onetapay. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
