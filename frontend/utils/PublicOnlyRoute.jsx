import React, { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import api from "./axios";

const PublicOnlyRoute = ({ children }) => {
  const [auth, setAuth] = useState(null); // null = checking

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        await api.get("/users/profile"); // cookie only
        if (!ignore) setAuth(true);
      } catch {
        if (!ignore) setAuth(false);
      }
    })();
    return () => (ignore = true);
  }, []);

  if (auth === null) return null; // or a spinner
  return auth ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicOnlyRoute;
