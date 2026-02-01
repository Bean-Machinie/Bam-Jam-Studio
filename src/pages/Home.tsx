import { useAuth } from "../auth/useAuth";

export default function Home() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div>
      <h1>Welcome, you are logged in</h1>
      {user?.email && <p>{user.email}</p>}
      <button type="button" onClick={handleSignOut}>
        Log out
      </button>
    </div>
  );
}