import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // Only redirect to auth if user is not signed in
      if (!user) {
        navigate("/auth");
      }
      // For email verification, only redirect if it's not the admin account
      else if (!user.emailVerified && user.email !== "disruptivefounder@gmail.com") {
        navigate("/auth");
      }
      // Don't automatically redirect admin users - let the component show access denied message
    }
  }, [user, isLoading, navigate, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // For admin account, skip email verification check
  if (!user.emailVerified && user.email !== "disruptivefounder@gmail.com") {
    return null;
  }

  if (requireAdmin && user.email !== "disruptivefounder@gmail.com") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">Admin privileges required.</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Current user: {user.email || 'No email'}</p>
            <p>Required: disruptivefounder@gmail.com</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Please sign in with the admin account to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}