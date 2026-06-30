import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, firebaseEnabled, googleProvider } from "../services/firebase";

const AuthContext = createContext(null);

const demoUser = { uid: "demo-user", displayName: "Demo Builder", email: "demo@lastminute.ai" };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(firebaseEnabled ? null : demoUser);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login: async () => {
      if (!firebaseEnabled) return setUser(demoUser);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    },
    logout: async () => {
      if (!firebaseEnabled) return setUser(demoUser);
      await signOut(auth);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
