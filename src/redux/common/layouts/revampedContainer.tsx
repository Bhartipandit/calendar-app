"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within RevampedContainer");
  return context;
};

interface RevampedContainerProps {
  children: ReactNode;
}

const RevampedContainer: React.FC<RevampedContainerProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthResolved(true);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Redirect AFTER render
  useEffect(() => {
    if (!authResolved) return;

    if (!user && pathname !== "/login") {
      router.replace("/login");
    }
  }, [user, authResolved, pathname, router]);

  // ⏳ Block UI until auth is resolved
  if (!authResolved) return null;

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default RevampedContainer;
