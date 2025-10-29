// src/App.jsx
import React, { useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import api from "../utils/axios";
import ProtectedRoute from "../utils/ProtectedRoute";
import PublicOnlyRoute from "../utils/PublicOnlyRoute";
import Login from "./Auth/Login/login";
import Register from "./Auth/Register/Registration";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
/* ----------  NAVBAR  ---------- */
import Dashboard from "./pages/Dashboard/dashboard";
import Main from "./pages/main/main";
import Profile from "./pages/Profile";
import ClientRoom from "./pages/Room/ClientRoom";
import JoinCreateRoom from "./pages/Room/JoinCreateRoom";

function App() {
  /* -------  GLOBAL AUTH STATE  ------- */
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState("");

  /* -------  MOUNT AUTH CHECK  ------- */
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get("/users/profile");
        if (!ignore) {
          setLoggedIn(true);
          setUserId(data.user._id);
          setUsername(data.user.username);
        }
      } catch {
        if (!ignore) setLoggedIn(false);
      }
    })();
    return () => (ignore = true);
  }, []);

  /* -------  LOGOUT  ------- */
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // swallow
    }
    setLoggedIn(false);
    setUserId("");
    localStorage.clear();
    // full-page redirect (safe without useNavigate here)
    window.location.href = "/login";
  };

  return (
    // top-level Router
    <Router>
      {/* root avoids accidental horizontal overflow */}
      <div className="min-h-screen w-full overflow-x-hidden bg-white text-gray-900">
        {/* Navbar is full-width but its inner content is constrained in Navbar.jsx */}
        <Navbar
          loggedIn={loggedIn}
          userId={userId}
          username={username}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onLogout={handleLogout}
        />

        {/* Routes & page content */}
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login setLoggedIn={setLoggedIn} setUserId={setUserId} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          {/* ======  PROTECTED  ====== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard userId={userId} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ClientRoom"
            element={
              <ProtectedRoute>
                <ClientRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/JoinCreateRoom"
            element={
              <ProtectedRoute>
                <JoinCreateRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
