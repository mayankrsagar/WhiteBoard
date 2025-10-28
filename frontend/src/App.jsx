import React, { useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import api from "../utils/axios";
import ProtectedRoute from "../utils/ProtectedRoute";
import Login from "./Auth/Login/login";
import Register from "./Auth/Register/Registration";
import Home from "./Components/Home";
/* ----------  NAVBAR  ---------- */
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard/dashboard";
import Main from "./pages/main/main";
import ClientRoom from "./pages/Room/ClientRoom";
import JoinCreateRoom from "./pages/Room/JoinCreateRoom";

function App() {
  /* -------  GLOBAL AUTH STATE  ------- */
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* -------  MOUNT AUTH CHECK  ------- */
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get("/users/profile");
        if (!ignore) {
          setLoggedIn(true);
          setUserId(data.user._id);
        }
      } catch {
        if (!ignore) setLoggedIn(false);
      }
    })();
    return () => (ignore = true);
  }, []);

  /* -------  LOGOUT  ------- */
  const handleLogout = async () => {
    await api.post("/auth/logout");
    setLoggedIn(false);
    setUserId("");
  };

  /* ==========================================
        ROUTER  (moved inside component tree)
     ========================================== */
  return (
    <Router>
      <div className="min-h-screen w-full">
        <Navbar
          loggedIn={loggedIn}
          userId={userId}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onLogout={handleLogout}
        />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={<Login setLoggedIn={setLoggedIn} setUserId={setUserId} />}
          />
          <Route path="/register" element={<Register />} />

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

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
