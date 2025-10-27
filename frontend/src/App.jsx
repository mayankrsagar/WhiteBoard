import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./Auth/Login/login";
import Register from "./Auth/Register/Registration";
import Home from "./Components/Home";
import Dashboard from "./pages/Dashboard/dashboard";
import Main from "./pages/main/main";
import ClientRoom from "./pages/Room/ClientRoom";
import JoinCreateRoom from "./pages/Room/JoinCreateRoom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        {/* ------- NAVBAR ------- */}
        <nav className="bg-gray-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand */}
              <div className="flex-shrink-0">
                <Link
                  to="/"
                  className="text-xl font-semibold tracking-wide hover:text-indigo-400 transition"
                >
                  Whiteboard
                </Link>
              </div>

              {/* Links */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-6">
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Home
                  </Link>
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Features
                  </Link>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Login / Register
                  </Link>
                </div>
              </div>

              {/* Mobile menu button (optional) */}
              <div className="md:hidden">
                <button className="text-gray-300 hover:text-white focus:outline-none">
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
          </div>
        </nav>

        {/* ------- ROUTES ------- */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Dashboard userId={userId} onLogout={handleLogout} />
              ) : (
                <Login setLoggedIn={setLoggedIn} setUserId={setUserId} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Main />} />
          <Route path="/ClientRoom" element={<ClientRoom />} />
          <Route path="/JoinCreateRoom" element={<JoinCreateRoom />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
