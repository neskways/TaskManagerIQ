import { Navigate } from "react-router-dom";
import { getFromLocalStorage } from "../../modules/localStorageUtils";

export const TaskRedirect = () => {
  
  const defaultPath = "/tasks/my_assigned";
  const saved = getFromLocalStorage("last_tasks_path", defaultPath);

  if (!saved.startsWith("/tasks/")) {
    return <Navigate to="my_assigned" replace />;
  }

  const subPath = saved.replace("/tasks/", "");

  return <Navigate to={subPath} replace />;
};
