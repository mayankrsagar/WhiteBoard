import { Navigate } from "react-router-dom";

export const CheckAuth = ({ children }) => {
  const userId = localStorage.getItem("userId");
  return userId ? children : <Navigate to="/login" replace />;
};
