import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="card h-32 w-80 animate-pulse" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
