// src/App.jsx
import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "../utils/ProtectedRoute";
import Login from "./Auth/Login/login";
import Register from "./Auth/Register/Registration";
import Home from "./Components/Home";
import Dashboard from "./pages/Dashboard/dashboard";
import Main from "./pages/main/main";
import ClientRoom from "./pages/Room/ClientRoom";
import JoinCreateRoom from "./pages/Room/JoinCreateRoom";

/* --------------------  APP  -------------------- */
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId("");
  };

  /* ----------  nav items  ---------- */
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Features", to: "/" },
    { label: "Login / Register", to: "/login" },
  ];

  return (
    <div className="min-h-screen w-full">
      <Router>
        {/* ----------------  NAVBAR  ---------------- */}
        <nav className="bg-red-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link
                to="/"
                className="text-2xl font-bold tracking-wide hover:text-indigo-400 transition focus:outline-none md:text-3xl"
              >
                Whiteboard
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-6 flex-1 justify-end gap-4">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition hover:text-indigo-400 focus:outline-none"
                  >
                    {l.label}
                  </Link>
                ))}
                {loggedIn && (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Hamburger */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileOpen((v) => !v)}
                  className="text-white hover:text-indigo-300 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
              <div className="md:hidden mt-2 space-y-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded-md text-base font-medium hover:bg-gray-800 transition"
                  >
                    {l.label}
                  </Link>
                ))}
                {loggedIn && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2 rounded-md text-base font-medium hover:bg-gray-800 transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 rounded-md text-base font-medium hover:bg-gray-800 transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* ----------------  ROUTES  ---------------- */}
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate replace to="/dashboard" />
              ) : (
                <Login setLoggedIn={setLoggedIn} setUserId={setUserId} />
              )
            }
          />
          <Route
            path="/register"
            element={
              loggedIn ? <Navigate replace to="/dashboard" /> : <Register />
            }
          />

          {/*  ======  PROTECTED PAGES  ======  */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <Dashboard userId={userId} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/main"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ClientRoom"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <ClientRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/JoinCreateRoom"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <JoinCreateRoom />
              </ProtectedRoute>
            }
          />

          {/* catch-all */}
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
