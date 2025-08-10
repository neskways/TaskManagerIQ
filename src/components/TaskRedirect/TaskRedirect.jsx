import { Navigate } from "react-router-dom";
import { getFromLocalStorage } from "../../modules/localStorageUtils";

export const TaskRedirect = () => {
  const defaultPath = "my_assigned";
  const fullSavedPath = getFromLocalStorage("last_secondary_sidebar_path", `/ticket/${defaultPath}`);

  const match = fullSavedPath.match(/^\/ticket\/(.+)$/);
  const nestedPath = match ? match[1] : defaultPath;

  return <Navigate to={nestedPath} replace />;
};
