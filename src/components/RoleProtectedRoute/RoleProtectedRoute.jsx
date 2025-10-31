
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export const RoleProtectedRoute = ({ 
  children, 
  allowEveryone = false, 
  allowDuty = false, 
  allowManagement = false 
}) => {
  const role = Cookies.get("role");

  const hasAccess =
    (role === import.meta.env.VITE_TOKEN_EMPLOYEE && allowEveryone) ||
    (role === import.meta.env.VITE_TOKEN_DUTY && allowDuty) ||
    (role === import.meta.env.VITE_TOKEN_MANAGER && allowManagement);

  if (!hasAccess) {
    return <Navigate to="/tasks/my_assigned" replace />;
  }

  return children;
};
