import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hook";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) return <>Loading........</> // custom loading screen

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
};


export default ProtectedRoute;