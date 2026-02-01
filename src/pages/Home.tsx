import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { hasSupabaseEnv } from "../lib/supabaseClient";

export default function Home() {
  const { user, loading, error } = useAuth();

  return (
    <div>
      <h1>Supabase + Vite Starter</h1>
      <p>Environment configured: {hasSupabaseEnv ? "Yes" : "No"}</p>
      {loading ? (
        <p>Checking auth session...</p>
      ) : error ? (
        <p>{error}</p>
      ) : user ? (
        <p>Signed in as {user.email}</p>
      ) : (
        <p>Not signed in.</p>
      )}
      <ul>
        <li>
          <Link to="/connect">Connection check</Link>
        </li>
        <li>
          <Link to="/login">Sign in / Sign up</Link>
        </li>
        <li>
          <Link to="/app">Protected todos app</Link>
        </li>
      </ul>
    </div>
  );
}