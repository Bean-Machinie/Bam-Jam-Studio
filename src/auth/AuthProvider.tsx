import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { hasSupabaseEnv, supabase } from "../lib/supabaseClient";

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv || !supabase) {
      setError("Missing Supabase environment variables.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!isMounted) return;
        if (sessionError) {
          setError(sessionError.message);
        }
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load session.");
        setLoading(false);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
      }
    );

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return "Supabase client is not configured.";
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return signInError?.message ?? null;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return "Supabase client is not configured.";
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });
    return signUpError?.message ?? null;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return "Supabase client is not configured.";
    const { error: signOutError } = await supabase.auth.signOut();
    return signOutError?.message ?? null;
  }, []);

  const value = useMemo(
    () => ({ user, session, loading, error, signIn, signUp, signOut }),
    [user, session, loading, error, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}