import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { signIn, signUp, user, loading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const action = mode === "signin" ? signIn : signUp;
    const errorMessage = await action(email, password);

    if (errorMessage) {
      setError(errorMessage);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  return (
    <div>
      <h1>{mode === "signin" ? "Sign In" : "Sign Up"}</h1>
      {loading && <p>Checking session...</p>}
      {authError && <p>{authError}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting
            ? "Working..."
            : mode === "signin"
            ? "Sign In"
            : "Sign Up"}
        </button>
      </form>
      <button
        type="button"
        onClick={() =>
          setMode((current) => (current === "signin" ? "signup" : "signin"))
        }
      >
        Switch to {mode === "signin" ? "Sign Up" : "Sign In"}
      </button>
    </div>
  );
}