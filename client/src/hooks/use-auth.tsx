import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, signInWithEmail, registerWithEmail, signOutUser, resetPassword, signInWithGoogle, resendEmailVerification } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: FirebaseUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  isEmailVerified: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      try {
        await signInWithEmail(email, password);
      } catch (error: any) {
        // If the admin account doesn't exist, create it automatically
        if (email === "disruptivefounder@gmail.com" && error.code === "auth/user-not-found") {
          console.log("Creating admin account...");
          const userCredential = await registerWithEmail(email, password);
          // For admin account, we'll skip email verification requirement
          console.log("Admin account created successfully");
        } else {
          throw error; // Re-throw other errors
        }
      }
      
      // For admin account, skip email verification check
      if (auth.currentUser && !auth.currentUser.emailVerified && email !== "disruptivefounder@gmail.com") {
        toast({
          title: "Email not verified",
          description: "Please check your email and click the verification link before signing in.",
          variant: "destructive",
        });
        await signOutUser();
        return;
      }
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      let message = "Failed to sign in";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later";
      }
      
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await registerWithEmail(email, password);
      
      toast({
        title: "Account created!",
        description: "Please check your email and click the verification link to complete your registration.",
      });
      
      // Sign out immediately after registration to force email verification
      await signOutUser();
    } catch (error: any) {
      let message = "Failed to create account";
      if (error.code === "auth/email-already-in-use") {
        message = "An account with this email already exists";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address";
      }
      
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
      toast({
        title: "Password reset sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      let message = "Failed to send password reset email";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address";
      }
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      
      // Check if this is the admin user and provide appropriate welcome message
      const isAdmin = auth.currentUser?.email === "disruptivefounder@gmail.com";
      
      toast({
        title: isAdmin ? "Welcome Admin!" : "Welcome!",
        description: isAdmin ? "You've successfully signed in with admin privileges." : "You've successfully signed in with Google.",
      });
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmailVerification = async () => {
    try {
      await resendEmailVerification();
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword: handleResetPassword,
    signInWithGoogle: handleSignInWithGoogle,
    resendEmailVerification: handleResendEmailVerification,
    isEmailVerified: user?.emailVerified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
