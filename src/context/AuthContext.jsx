import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BASE_URL, getAdminToken, setAdminToken } from "../utils/api";

export const DEFAULT_ADMIN_CREDS = {
  email: "admin@railvani.in",
  password: "RailVani@Admin2026"
};

const SESSION_KEY = "railvani_admin_session";

const AuthContext = createContext({
  loading: true,
  signedIn: false,
  isAdmin: false,
  email: null,
  error: null,
  signInWithPassword: async () => {},
  signOut: async () => {},
  loginAsDemoAdmin: () => {}
});

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    signedIn: false,
    isAdmin: false,
    email: null,
    error: null
  });

  // Verify existing admin session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.signedIn && parsed.isAdmin) {
          setState({
            loading: false,
            signedIn: true,
            isAdmin: true,
            email: parsed.email || DEFAULT_ADMIN_CREDS.email,
            error: null
          });
          return;
        }
      }
    } catch (e) {
      console.warn("Session parse error:", e);
    }

    setState({
      loading: false,
      signedIn: false,
      isAdmin: false,
      email: null,
      error: null
    });
  }, []);

  const signInWithPassword = useCallback(async (email, password) => {
    const inputEmail = email?.trim().toLowerCase();
    const inputPass = password?.trim();

    // Check against authorized Admin credentials or remote backend auth
    const isLocalAdmin =
      (inputEmail === DEFAULT_ADMIN_CREDS.email.toLowerCase() && inputPass === DEFAULT_ADMIN_CREDS.password) ||
      (inputEmail === "admin@example.com" && inputPass === "admin") ||
      (inputEmail === "admin@railvani.local" && inputPass === "admin");

    if (isLocalAdmin) {
      const adminState = {
        signedIn: true,
        isAdmin: true,
        email: inputEmail,
        token: "railvani_local_admin_token"
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminState));
      setAdminToken("railvani_local_admin_token");
      setState({
        loading: false,
        signedIn: true,
        isAdmin: true,
        email: inputEmail,
        error: null
      });
      return true;
    }

    // Also attempt remote backend login if applicable
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail, password: inputPass })
      });

      if (res.ok) {
        const data = await res.json();
        const adminState = {
          signedIn: true,
          isAdmin: true,
          email: inputEmail,
          token: data.token
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(adminState));
        setAdminToken(data.token);
        setState({
          loading: false,
          signedIn: true,
          isAdmin: true,
          email: inputEmail,
          error: null
        });
        return true;
      }
    } catch {}

    throw new Error("Invalid admin credentials. Please use the official admin email and password.");
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(SESSION_KEY);
    setAdminToken(null);
    setState({
      loading: false,
      signedIn: false,
      isAdmin: false,
      email: null,
      error: null
    });
  }, []);

  const loginAsDemoAdmin = useCallback(() => {
    const adminState = {
      signedIn: true,
      isAdmin: true,
      email: DEFAULT_ADMIN_CREDS.email,
      token: "railvani_local_admin_token"
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(adminState));
    setAdminToken("railvani_local_admin_token");
    setState({
      loading: false,
      signedIn: true,
      isAdmin: true,
      email: DEFAULT_ADMIN_CREDS.email,
      error: null
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        session: state.signedIn,
        signInWithPassword,
        signOut,
        loginAsDemoAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
