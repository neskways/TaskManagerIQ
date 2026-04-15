import { Navigate } from "react-router-dom";
import { getFromLocalStorage } from "../../modules/localStorageUtils";

export const TaskRedirect = () => {
  
  const defaultPath = "/tickets/my_assigned";
  const saved = getFromLocalStorage("last_tasks_path", defaultPath);

  if (!saved.startsWith("/tickets/")) {
    return <Navigate to="my_assigned" replace />;
  }

  const subPath = saved.replace("/tickets/", "");

  return <Navigate to={subPath} replace />;
};
