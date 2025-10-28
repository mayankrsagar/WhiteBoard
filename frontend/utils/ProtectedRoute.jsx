import React, { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import api from "./axios";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = loading

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        await api.get("/users/profile"); // cookie only
        if (!ignore) setIsAuth(true);
      } catch {
        if (!ignore) setIsAuth(false);
      }
    })();
    return () => (ignore = true);
  }, []);

  if (isAuth === null)
    return <div className="min-h-screen grid place-items-center">Loading…</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
