"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  authResolved: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within RevampedContainer");
  return ctx;
};

const RevampedContainer = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthResolved(true);
    });

    return unsubscribe;
  }, []);

  if (!authResolved) return null;

  return (
    <AuthContext.Provider value={{ user, authResolved }}>
      {children}
    </AuthContext.Provider>
  );
};

export default RevampedContainer;
