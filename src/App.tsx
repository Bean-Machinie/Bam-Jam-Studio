import { Link, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Connect from "./pages/Connect";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TodosApp from "./pages/TodosApp";

export default function App() {
  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link to="/">Home</Link>
          <Link to="/connect">Connect</Link>
          <Link to="/login">Login</Link>
          <Link to="/app">Todos App</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <TodosApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}