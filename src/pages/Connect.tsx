import { useEffect, useState } from "react";
import { hasSupabaseEnv, supabase } from "../lib/supabaseClient";

export default function Connect() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv || !supabase) {
      setStatus("error");
      setMessage("Missing Supabase environment variables.");
      return;
    }

    let isMounted = true;
    setStatus("loading");
    setMessage(null);

    supabase
      .from("todos")
      .select("id", { count: "exact", head: true })
      .then(({ error }) => {
        if (!isMounted) return;
        if (error) {
          setStatus("error");
          setMessage(error.message);
        } else {
          setStatus("success");
          setMessage("Connected to Supabase.");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Request failed.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h1>Connection Check</h1>
      <p>Env vars present: {hasSupabaseEnv ? "Yes" : "No"}</p>
      <p>Status: {status}</p>
      {message && <p>{message}</p>}
      <p>
        Note: if you are not signed in yet, a permission error is expected due
        to RLS.
      </p>
    </div>
  );
}