import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute({
  children,
  isAllowed,
  redirect = "/",
}) {
  if (!isAllowed) return <Navigate to={redirect} />;
  return children || <Outlet />;
}
