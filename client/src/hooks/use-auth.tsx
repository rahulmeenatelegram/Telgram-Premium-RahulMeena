import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUser 
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createUser, getUser } from "@/lib/firebase-service";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/firebase-types";

type AuthContextType = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setError(null);
      
      if (firebaseUser) {
        try {
          setFirebaseUser(firebaseUser);
          
          // Get or create user in Firestore
          let appUser = await getUser(firebaseUser.uid);
          
          if (!appUser) {
            // Create new user - only first user gets admin role
            const isFirstUser = firebaseUser.email === "disruptivefounder@gmail.com";
            appUser = await createUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: isFirstUser ? "admin" : "user"
            });
          }
          
          setUser(appUser);
        } catch (err) {
          console.error("Error handling auth state change:", err);
          setError(err as Error);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError(err as Error);
      toast({
        title: "Sign-in failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Email sign-in failed:", err);
      setError(err as Error);
      toast({
        title: "Sign-in failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const registerWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err as Error);
      const errorMessage = err instanceof Error && err.message.includes('email-already-in-use') 
        ? "Email is already registered. Please sign in instead."
        : "Registration failed. Please try again.";
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
      setError(err as Error);
      toast({
        title: "Logout failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        error,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        logout,
        isAdmin,
      }}
    >
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