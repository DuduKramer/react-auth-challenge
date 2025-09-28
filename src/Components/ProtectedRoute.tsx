import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const raw = localStorage.getItem("auth.tokens");
  const accessToken = raw ? JSON.parse(raw).accessToken : null;
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
