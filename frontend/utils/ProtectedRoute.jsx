import React, { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import api from "../utils/axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("No user ID found");

        const { data } = await api.get(`/users/profile/${userId}`);
        if (data.username) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        console.log(err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen grid place-items-center text-lg text-gray-700">
        Loading…
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
