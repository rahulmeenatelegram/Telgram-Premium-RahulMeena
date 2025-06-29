import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { FaGoogle } from "react-icons/fa";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, Zap, Star } from "lucide-react";
import { Link } from "wouter";

export default function AuthPage() {
  const { user, signInWithGoogle, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already authenticated
  if (user) {
    navigate(user.role === "admin" ? "/admin" : "/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome to TeleChannels</CardTitle>
                <CardDescription>
                  Sign in with Google to access premium Telegram channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  size="lg"
                >
                  <FaGoogle className="w-5 h-5 text-red-500" />
                  <span>Continue with Google</span>
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  <p>By signing in, you agree to our Terms of Service</p>
                  <p className="mt-1">and Privacy Policy</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Hero Section */}
          <div className="hidden lg:block">
            <div className="text-center space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Join Premium Telegram Communities
                </h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  Get instant access to exclusive content, trading signals, and expert insights from verified professionals.
                </p>
              </div>

              <div className="grid gap-6 max-w-sm mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Instant Access</h3>
                    <p className="text-sm text-gray-600">Immediate channel access after payment</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Secure Payments</h3>
                    <p className="text-sm text-gray-600">Razorpay secured transactions</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="text-purple-600 w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Premium Content</h3>
                    <p className="text-sm text-gray-600">Curated by verified experts</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 max-w-sm mx-auto">
                <p className="text-sm text-gray-600 mb-2">Trusted by</p>
                <p className="text-2xl font-bold text-blue-600">1,000+ Members</p>
                <p className="text-xs text-gray-500">Join our growing community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}