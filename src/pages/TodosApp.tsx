import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { supabase } from "../lib/supabaseClient";

type Todo = {
  id: string;
  user_id: string;
  title: string;
  is_done: boolean;
  created_at: string;
};

export default function TodosApp() {
  const { user, signOut } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    if (!supabase || !user) return;
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("todos")
      .select("id, user_id, title, is_done, created_at")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setTodos(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !user || !title.trim()) return;

    setBusyId("new");
    setError(null);

    const { error: insertError } = await supabase.from("todos").insert([
      {
        title: title.trim(),
        user_id: user.id
      }
    ]);

    setBusyId(null);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setTitle("");
    fetchTodos();
  };

  const toggleTodo = async (todo: Todo) => {
    if (!supabase) return;
    setBusyId(todo.id);
    setError(null);

    const { error: updateError } = await supabase
      .from("todos")
      .update({ is_done: !todo.is_done })
      .eq("id", todo.id);

    setBusyId(null);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    fetchTodos();
  };

  const deleteTodo = async (todo: Todo) => {
    if (!supabase) return;
    setBusyId(todo.id);
    setError(null);

    const { error: deleteError } = await supabase
      .from("todos")
      .delete()
      .eq("id", todo.id);

    setBusyId(null);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    fetchTodos();
  };

  const handleSignOut = async () => {
    setSignOutError(null);
    const errorMessage = await signOut();
    if (errorMessage) {
      setSignOutError(errorMessage);
    }
  };

  if (!user) {
    return <div>Missing user session.</div>;
  }

  return (
    <div>
      <h1>Todos</h1>
      <p>Signed in as {user.email}</p>
      <button type="button" onClick={handleSignOut}>
        Sign Out
      </button>
      {signOutError && <p>{signOutError}</p>}

      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New todo"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <button type="submit" disabled={busyId === "new"}>
          {busyId === "new" ? "Adding..." : "Add"}
        </button>
      </form>

      {loading ? (
        <p>Loading todos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.is_done}
                  onChange={() => toggleTodo(todo)}
                  disabled={busyId === todo.id}
                />
                {" "}
                {todo.title}
              </label>
              <button
                type="button"
                onClick={() => deleteTodo(todo)}
                disabled={busyId === todo.id}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}