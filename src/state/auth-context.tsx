import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEMO_EMAIL, DEMO_PASSWORD, ORDER_KEY, SESSION_KEY } from "../lib/session.ts";

export type Session = {
  email: string;
};

type AuthContextValue = {
  session: Session | null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      login: async (email, password) => {
        await delay(550);
        const normalized = email.trim().toLowerCase();
        if (normalized !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
          return "Email-i ose fjalëkalimi nuk përputhet.";
        }
        const next = { email: normalized };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
        setSession(next);
        return null;
      },
      logout: () => {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(ORDER_KEY);
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;
    if (typeof record.email !== "string" || record.email.trim() === "") return null;
    return { email: record.email };
  } catch {
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
