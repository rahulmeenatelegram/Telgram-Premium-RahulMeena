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
      if (!user || !user.emailVerified) {
        navigate("/auth");
      } else if (requireAdmin && user.email !== "disruptivefounder@gmail.com") {
        navigate("/");
      }
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

  if (!user || !user.emailVerified) {
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
            <p>Email verified: {user.emailVerified ? 'Yes' : 'No'}</p>
            <p>Required: disruptivefounder@gmail.com</p>
            <p>Debug: {JSON.stringify({
              userEmail: user.email,
              emailVerified: user.emailVerified,
              uid: user.uid
            })}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Please sign in with the admin account and ensure email is verified.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}