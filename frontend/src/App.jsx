import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        {!token && <Link to="/register">Register</Link>}
        {!token && <Link to="/login">Login</Link>}
        {token && <Link to="/dashboard">Dashboard</Link>}
        {token && <button onClick={handleLogout}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to Frontend Demo</h1>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard token={token} /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
